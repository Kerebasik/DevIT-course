import React, {useEffect, useMemo, useState} from "react";


import './Panel.style.scss'
import {Button} from "../Button/Button";
import {Title} from "../Title/Title";
import {useSelector} from "react-redux";
import {GameHttpService} from "../../services/gameHttpService";

const Panel = ()=>{
    const {game} = useSelector(state => state.gameReducer)

    const userReady = useMemo(()=>{
        return game?.players.filter(item=>item.player.name === game?.userId)[0].ready
    },[game])

    const [ready, setReady] = useState()

    useEffect(() => {
        setReady(userReady)
    }, [userReady]);

    const handleReadyToGameOnClick = () =>{
        GameHttpService.readyToGame()
        setReady(true)
    }

    const handleHitOnClick = () =>{
        GameHttpService.playerTurn('hit')
    }

    const handlePassOnClick = () =>{
        GameHttpService.playerTurn('pass')
    }

    return(
        <div className="panel">
            <div className={'panel__log'}>
                {
                    game?.log.map((item, index)=>{
                        return <p key={Date.now()+index}>{item[0]} - {item[1]}</p>
                    })
                }
            </div>

            <Title size={18}>Ты <br/> {game?.userId}</Title>
            {
                !ready &&
                <Button handleOnClick={handleReadyToGameOnClick}>Готов</Button>
            }


            <div>
                {
                    game?.winner && <Title size={18}>Победитель {game?.winner}</Title>
                }
                {
                    !game?.start &&
                    <Title size={18}>Игроков готово { game?.players.filter( item => item.ready ).length }/{game?.players.length}</Title>
                }
                <br/>
                {
                    !game?.gameOver &&
                    <Title size={18}>Ходит игрок: Player {game?.players[game?.currentPlayerIndex].player.name}</Title>
                }
            </div>
            {
                game?.start
                    ?
                    <div>
                        <Button handleOnClick={handleHitOnClick}> Взять карту </Button>
                        <Button handleOnClick={handlePassOnClick}> Пасс </Button>
                    </div>
                    :
                    <div>
                        <Button handleOnClick={handleHitOnClick} disabled={true}> Взять карту </Button>
                        <Button handleOnClick={handlePassOnClick} disabled={true}> Пасс </Button>
                    </div>
            }

        </div>
    )
}

export {Panel}