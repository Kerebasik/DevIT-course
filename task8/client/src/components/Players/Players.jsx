import React, {useEffect, useState} from "react";
import {Player} from "../Player/Player";

const Players = ({players, gameStart}) => {

    const [playersList, setPlayersList] = useState(players)

    useEffect(()=>{
        setPlayersList([...players])
    }, [players, gameStart]) // следим за началом игры и изменениями игроков

    return(
        <>
            <div className="players">
                <div className="title">
                    <h1>Players:</h1>
                </div>
                {
                    gameStart && // открываем поля игроков когда игра началась
                    <div className="players__row">
                        {
                            playersList?.map((player, index) => {
                                return <Player
                                    key={ Date.now()+index} // уникальный ключ
                                    player={player} // пробрасываем игрока
                                />
                            })
                        }
                    </div>
                }
            </div>
        </>
    )
}

export { Players }