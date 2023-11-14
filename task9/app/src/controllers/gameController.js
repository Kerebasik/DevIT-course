import {Game} from "../services/game.js";
import {Player} from "../services/player.js";
import { v4 as uuidv4 } from 'uuid';

class GameController {
    static async createGame(req, res){
        const gamesCollection = req.app.locals.games
        try {
            const id = uuidv4();
            const player = new Player(id)
            const game = new Game(player)
            gamesCollection.insertOne({
                players:game.players,
                deck:game.deck.deck,
                playersMove:game.currentPlayerIndex,
                gameOver:game.gameOver,
                gameStart:game.start
            })
            res.json({name:player.name})

        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    }

    static async joinToGame(req, res){
        const gamesCollection = req.app.locals.games
        try {
            const game = await gamesCollection.find().toArray()
            res.json(game)
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }

    }

    static game(req, res){
        try {

        } catch (e){
            console.error(e)
            res.sendStatus(500)
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