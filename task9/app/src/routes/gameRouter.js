import express from "express";
import {GameController} from "../controllers/gameController.js";


const gameRouter = express.Router()

gameRouter.post('/new-game', GameController.createGame)
gameRouter.post('/join-game', GameController.joinToGame)
gameRouter.post('/game', GameController.game)
gameRouter.post('/turn', GameController.turn)

export {gameRouter}