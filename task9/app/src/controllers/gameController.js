import {Game} from "../services/game.js";
import {Player} from "../services/player.js";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {GameDtoForClient} from "../dtos/gameDtoForClient.js";

const secretKey = process.env.ACCESS_TOKEN_SIGNATURE

class GameController {
    static async createGame(req, res){
        const gamesCollection = req.app.locals.games
        try {
            const id = uuidv4();
            const player = new Player(id)
            const game = new Game(player)
            const newGameResult = await gamesCollection.insertOne(game.getAllProperties())

            // Получаем вставленный идентификатор
            const insertedId = newGameResult.insertedId;

            // Если вы хотите получить полный вставленный документ, вы можете использовать findOne
            const insertedGame = await gamesCollection.findOne({ _id: insertedId });

            const payload = {
                userId: id,
                roomId: insertedGame._id
            };

            const token = jwt.sign(payload, `${secretKey}`, { expiresIn: '15m' });

            res.json({
                roomId: insertedGame._id,
                accessToken: token
            })

        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    }

    static readyToGame = async (req, res)=> {

        //todo Доделать эндпоинт для  готовности в игре
        const gamesCollection = req.app.locals.games;
        const userId = req.userId;
        const roomId = req.roomId;

        try {
            const game = await gamesCollection.findOne({
                _id: new ObjectId(roomId),
            });

            if (!game) {
                return res.status(404).json({ message: "Игрок или игра не найдены" });
            }

            const updatedPlayers = game.players.map(player => {
                if (player.userId === userId) {
                    player.ready = true;
                }
                return player;
            });

            await gamesCollection.updateOne(
                {
                    _id: new ObjectId(roomId),
                    "players.userId": userId
                },
                { $set: { players: updatedPlayers } }
            );

            return res.status(200).json({ message: "Готов!" });
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    }

    static async joinToGame(req, res){
        const gamesCollection = req.app.locals.games
        const roomId = req.body.roomId

        if(roomId.length !== 24){
            return res.status(400).json({message:"Не валидный roomId"})
        }

        try {
            const newUserId = uuidv4();
            const newPlayer = new Player(newUserId)
            const game = await gamesCollection.findOne({_id:new ObjectId(roomId)})
            if(!game){
                return res.status(404).json({message:"Игра не найдена"})
            }
            //
            const initialPlayer = Game.initialPlayers([newPlayer.getAllProperties()])
            // добавляю в игру нового игрока
            game.players.push(initialPlayer[0])

            await gamesCollection.updateOne(
                { _id: new ObjectId(roomId) },
                { $set: { players: game.players } }
            );

            //todo сделать сервис для генерации и расшифровывания токена

            const token = jwt.sign({roomId, userId:newUserId}, `${secretKey}`,{ expiresIn: '15m' })

            return res.status(200).json({
                roomId:roomId,
                accessToken:token
            })
        } catch (e) {
            console.error(e)
            return res.sendStatus(500)
        }
    }

    static async game(req, res){
        const gamesCollection = req.app.locals.games
        const roomId = req.roomId
        try {
            const game = await gamesCollection.findOne({_id:new ObjectId(roomId)})

            if(!game){
                return res.status(404).json({message:"Игра не найдена"})
            }

            const gameForClient = new GameDtoForClient(game)

            return res.status(200).json(gameForClient)
        } catch (e){
            console.error(e)
            return res.sendStatus(500)
        }
    }

    static turn(req, res){
        try {

        } catch (e){
            console.error(e)
            res.sendStatus(500)
        }
    }
}

export {GameController}