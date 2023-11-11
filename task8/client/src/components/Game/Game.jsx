import React, {useState} from "react";
import {Panel} from "../Panel/Panel";
import {Player} from "../../services/player";
import {Game} from "../../services/game";
import './Game.style.scss'
import {Players} from "../Players/Players";

const GameBlackJack = ()=>{
    const [game] = useState(new Game([
        new Player('Player 1'),
        new Player('Player 2'),
        new Player('Player 3'),
        new Player('Player 4')
    ]))

    const [players, setPlayers] = useState([])
    const [start, setStart] = useState(game.start)

    const handleStartGame = ()=>{

        game.startGame()
        setStart(game.start)
        setPlayers([...game.players])
    }

    const handlePlayerMove = ()=>{
        game.playerMove()
        setPlayers([...game.players])
    }

    const handlePlayerPass = ()=>{
        game.playerPass()
        setPlayers([...game.players])
    }

    return(
        <div className={'blackjack-table'}>
            <Players gameStart={start} players={players}/>
            <Panel
                gameStart={start}
                currentPlayer={game.getCurrentPlayerName()}
                handlePlayerPass={handlePlayerPass}
                handlePlayerMove={handlePlayerMove}
                handleStartGame={handleStartGame}
            />
        </div>
    )
}

export { GameBlackJack }