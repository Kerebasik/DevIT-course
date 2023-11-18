import {Game} from "../services/game.js";
import {Player} from "../services/player.js";
import { v4 as uuidv4 } from 'uuid';
import {ObjectId} from "mongodb";
import {GameDtoForClient} from "../dtos/gameDtoForClient.js";
import {TokenService} from "../services/tokenService.js";
import {LogService} from "../services/logService.js";
import {logsMessages} from "../constants/logs.js";
import {userActions} from "../constants/userActions.js";
import {serverStatus} from "../constants/serverStatus.js";
import {serverMessage} from "../constants/serverMessage.js";

class GameController {
    static async createGame(req, res){
        const gamesCollection = req.app.locals.games
        try {
            const id = uuidv4();
            const player = new Player(id)
            const game = new Game(player)

            LogService.addLogToGame(game, logsMessages.createdRoom, id )
            const newGameResult = await gamesCollection.insertOne(game.getAllProperties())

            // Получаем вставленный идентификатор
            const insertedId = newGameResult.insertedId;

            // Если вы хотите получить полный вставленный документ, вы можете использовать findOne
            const insertedGame = await gamesCollection.findOne({ _id: insertedId });

            const token = TokenService.generateToken({ userId: id,  roomId: insertedGame._id })

            res.status(serverStatus.OK).json({
                roomId: insertedGame._id,
                accessToken: token
            })

        } catch (e) {
            console.error(e)
            res.sendStatus(serverStatus.SERVER_ERROR)
        }
    }

    static readyToGame = async (req, res)=> {

        const gamesCollection = req.app.locals.games;
        const userId = req.userId;
        const roomId = req.roomId;

        try {
            const game = await gamesCollection.findOne({
                _id: new ObjectId(roomId),
            });

            if (!game) {
                return res.status(serverStatus.NOT_FOUND).json(serverMessage.NOT_FOUND);
            }

            LogService.addLogToGame(game, logsMessages.readyToGame, userId)

            const updatedPlayers = game.players.map((item) => {
                if(item.player.name === userId ){
                    item.ready = true
                }
                return item
            });

            const updatedGame = await gamesCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(roomId),
                },
                { $set: { players: updatedPlayers, log:game.log } },
                { returnDocument: 'after' }
            );

            if (updatedGame.players.every((item) => item.ready)) {
                updatedGame.start = true;

                Game.dealInitialCards(updatedGame)

                LogService.addLogToGame(updatedGame, logsMessages.gameStart)

                await gamesCollection.updateOne(
                    { _id: new ObjectId(roomId) },
                    { $set: { ...updatedGame} }
                );

            }

            const gameDTO = new GameDtoForClient(updatedGame)

            return res.status(serverStatus.OK).json(gameDTO);
        } catch (e) {
            console.error(e);
            return res.sendStatus(serverStatus.SERVER_ERROR);
        }
    }

    static async joinToGame(req, res){
        const gamesCollection = req.app.locals.games
        const roomId = req.body.roomId
        if(roomId.length !== 24){
            return res.status(serverStatus.BAD_REQUEST).json(serverMessage.ROOM_ID_NOT_VALID)
        }

        try {
            const newUserId = uuidv4();
            const newPlayer = new Player(newUserId)
            const game = await gamesCollection.findOne({_id:new ObjectId(roomId)})
            // проверяем есть ли комната с таким ид
            if(!game){
                return res.status(serverStatus.NOT_FOUND).json(serverMessage.USER_NOT_FOUND)
            }

            //Создаю лог
            LogService.addLogToGame(game, logsMessages.joinToRoom,  newUserId)

            // проверяем начала ли игра
            if(game.start){
                return res.status(serverStatus.BAD_REQUEST).json(serverMessage.GAME_START)
            }

            const initialPlayer = Game.initialPlayers([newPlayer.getAllProperties()])
            // добавляю в игру нового игрока
            game.players.push(initialPlayer[0])


            await gamesCollection.updateOne(
                { _id: new ObjectId(roomId) },
                { $set: { players: game.players, log:game.log } }
            );

            const token = TokenService.generateToken({roomId, userId:newUserId})

            return res.status(serverStatus.OK).json({
                roomId:roomId,
                accessToken:token
            })
        } catch (e) {
            console.error(e)
            return res.sendStatus(serverStatus.SERVER_ERROR)
        }
    }

    static async game(req, res){
        const gamesCollection = req.app.locals.games
        const roomId = req.roomId
        const userId = req.userId
        try {
            const game = await gamesCollection.findOne({_id:new ObjectId(roomId)})

            if(!game){
                return res.status(serverStatus.NOT_FOUND).json(serverMessage.GAME_NOT_FOUND)
            }

            const gameForClient = new GameDtoForClient({...game, userId})

            return res.status(serverStatus.OK).json(gameForClient)
        } catch (e){
            console.error(e)
            return res.sendStatus(serverStatus.SERVER_ERROR)
        }
    }

    static async turn(req, res){
        const {roomId, userId} = req
        const gamesCollection = req.app.locals.games

        const {action} = req.query
        try {
            const game = await gamesCollection.findOne({_id:new ObjectId(roomId)})
            if(game.gameOver){
                return res.status(serverStatus.BAD_REQUEST).json(serverMessage.GAME_END)
            }

            if(!game.start){
                return res.status(serverStatus.BAD_REQUEST).json(serverMessage.GAME_NOT_READY)
            }

            const indexPlayer = game.currentPlayerIndex
            if(game.players[indexPlayer].player.name !== userId){
                return  res.status(serverStatus.BAD_REQUEST).json(serverMessage.USER_NOT_YOUR_TURN)
            }


            if(action === userActions.hit){

                LogService.addLogToGame(game, logsMessages.userHitCard, userId)


                Game.playerMove(game)
                await gamesCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(roomId),
                    },
                    { $set: { ...game } },
                    { returnDocument: 'after' }
                );
                return res.status(serverStatus.OK).json(new GameDtoForClient(game))
            }

            if(action === userActions.pass){

                LogService.addLogToGame(game, logsMessages.userPass, userId)

                Game.playerPass(game)
                await gamesCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(roomId),
                    },
                    { $set: { ...game } },
                    { returnDocument: 'after' }
                );
                return res.status(serverStatus.OK).json(new GameDtoForClient(game))
            }

        } catch (e){
            console.error(e)
            res.sendStatus(serverStatus.SERVER_ERROR)
        }
    }
}

export {GameController}