import React, {useEffect, useState} from "react";
import {Panel} from "../Panel/Panel";
import {Player} from "../../services/player";
import {CardDeck} from "../../services/card-deck";
import './Game.style.scss'
import {Players} from "../Players/Players";

const Game = ()=>{
    const [players, setPlayers] = useState([
        { player: new Player('Player 1'), pass:false, over:false },
        { player: new Player('Player 2'), pass:false, over:false },
        { player: new Player('Player 3'), pass:false, over:false },
        { player: new Player('Player 4'), pass:false, over:false },
    ])
    const [start, setStart] = useState(false)
    const [deck] = useState(new CardDeck())
    const [gameOver, setGameOver] = useState(false)
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    const handleStartGame = () => {
        //стартую игру
        setCurrentPlayerIndex(0)
        setGameOver(false)
        setStart(true)
        // выдаю всем игрокам по 2 карты
        players.map((item) => {
            item.player.addCard(deck.drawCard())
            item.player.addCard(deck.drawCard())
        })
        // сохраняю игроков
        setPlayers(players)
    }

    const nextPlayer = () => {
        // счетчик хода игрока
        // если счетчик меньше максимального значения игрока то даем ход следующему игроку
        if(currentPlayerIndex < players.length - 1){
            setCurrentPlayerIndex(prevState => prevState + 1)
        } else {
            // дошли до последнего игрока обнуляем счетчик, чтобы начать с первого
            setCurrentPlayerIndex(0)
        }
    }

    //Поиск ближайшего игрока с меньшим к 21
    const closestTo21 = () =>{ //
        // отбрасіваем игроков у которых больше 21
        const winner = players.filter((player) => player.player.getHandValue() <= 21)
        winner.sort((a, b)=> a.player.getHandValue() - b.player.getHandValue() )
        return winner.at(-1)
    }

    // добавляем карту игроку
    const addCardToPlayer = () =>{
        // игроку с индексом игрока которому разрешено ходить добавляем на руку карту
        players[currentPlayerIndex].player.addCard(deck.drawCard())
        // если у игрока после того как он взял карту больше 21,
        // обозначаем что у него перебор и автоматически ставим что он сделал пасс
        if(players[currentPlayerIndex].player.getHandValue()>21){
            players[currentPlayerIndex].over = true
            players[currentPlayerIndex].pass = true
        }
        // сохраняем игроков
        setPlayers(players)
        // ход следующего игрока
        nextPlayer()
    }

    // обработчик если игрок спасовал по своей воли
    const playerPassed = () => {
        // обозначаем что игрок сделал пасс
        players[currentPlayerIndex].pass = true
        // ход следующего игрока
        nextPlayer()
    }

    const gameEnd = () => {
        setStart(false)
        players.map((item) => {
            item.player.clearHand()
            item.over = false
            item.pass = false
        })
        setPlayers(players)
    }

    // после каждого изменения индекса очередности хода проверяем может ли игрок ходить,
    // то есть он не сделал пасс в прошлых раундах и у него нет перебора
    useEffect(()=>{
        // если игра не закончена, то
        if(!gameOver){
            // проверяем есть ли у игрока пасса или перебора, если есть, то
            if(players[currentPlayerIndex].pass === true || players[currentPlayerIndex].over === true){
                // даем ход следующему игроку
                nextPlayer()
            }

            // проверяем у всех ли игроков пасс, если да, то
            if(players.every((player)=>{ return player.pass})){
                // заканчиваем игру
                setGameOver(true)
            }
        } else {
            // если игра закончена, то ищем ближайшего большего к 21
            const winner = closestTo21()
            // выводим имя победившего игрока
            alert(winner?.player?.name || 'Ничья')
            gameEnd()
        }
    },[currentPlayerIndex]) // следим за счетчиком очередности хода

    return(
        <div className="blackjack-table">
            <Players
                gameStart={start} // пробрасываем начало игры
                players={players} // пробрасываем игроков
            />

            <Panel
                gameStart={start} // пробрасываем что игра началась
                handleAddCardToPlayer={addCardToPlayer} // пробрасываем обработчик взятия карт
                handlePlayerPassed={playerPassed} // пробрасываем обработчик пасса
                handleStartGame={handleStartGame} // пробрасываем обработчик начала игры
                currentPlayerIndex={currentPlayerIndex} // пробрасываем индекс игрока который ходит
            />
        </div>
    )
}

export { Game }