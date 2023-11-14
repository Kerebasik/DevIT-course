import React, from "react";
import {Player} from '../../services/player'
import {PlayerItem} from "../Player/Player";
import './PlayersList.style.scss'
import {Title} from "../Title/Title";
import {useParams} from "react-router-dom";

const PlayersList = ({players=[
    new Player('Player 1'),
    new Player('Player 2'),
    new Player('Player 3'),
    new Player('Player 4')
], gameStart}) => {
    const {id} = useParams()

    return(
        <div className={'players'}>
            <div className={'players__title'}>
                <Title>Room: {id}</Title>
            </div>
            <div>
                <div className="players__row">
                    {
                        players?.map((player, index) => {
                            return <PlayerItem
                                key={ Date.now()+index} // уникальный ключ
                                player={player} // пробрасываем игрока
                            />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export { PlayersList }