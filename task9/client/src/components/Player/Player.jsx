import React from "react";
import './Player.style.scss'

const PlayerItem = ({player, index}) => {
    return(
        <div className="player">
            <div className="player__title">
                <h3>Player {index}</h3>
                {
                    player?.over && // отображаем в случае перебора
                    <p>Перебор</p>
                }
                {
                    player.pass && // отображаем в случае перебора
                    <p>Пасс</p>
                }
                {/*         отображаем количество баллов на руках         */}
                <p>{}</p>
            </div>

            <div className="player__hand">
                {
                    // Рендер карт на руках
                    player?.player?.hand.map((card,index)=>{
                        return <div key={Date.now() + index}> {card.rank} {card.suit}</div>
                    })
                }
            </div>
        </div>
    )
}

export {PlayerItem}