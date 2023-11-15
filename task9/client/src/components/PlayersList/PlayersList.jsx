import React from "react";
import {PlayerItem} from "../Player/Player";
import './PlayersList.style.scss'
import {Title} from "../Title/Title";
import {useSelector} from "react-redux";

const PlayersList = () => {

    const {game} = useSelector(state => state.gameReducer)

    return(
        <div className={'players'}>
            <div className={'players__title'}>
                <Title>Room: {game?.id}</Title>
            </div>

            <div className="players__row">
                {
                    game?.players?.map((player, index) => {
                        return <PlayerItem
                            key={ Date.now()+index} // уникальный ключ
                            player={player} // пробрасываем игрока
                            index={index+1}
                        />
                    })
                }
            </div>
        </div>
    )
}

export { PlayersList }