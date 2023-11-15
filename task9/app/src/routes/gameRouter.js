import express from "express";
import {GameController} from "../controllers/gameController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";


const gameRouter = express.Router()

gameRouter.post('/new-game', GameController.createGame)
gameRouter.post('/join-game', GameController.joinToGame)
gameRouter.post('/game', authMiddleware, GameController.game)
gameRouter.post('/turn', authMiddleware, GameController.turn)
gameRouter.post('/ready-to-game', authMiddleware, GameController.readyToGame)

export {gameRouter}