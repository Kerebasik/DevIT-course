import React from "react";
import { CustomButton } from "../Button/Button";

const Panel = ({gameStart, handleStartGame, handleAddCardToPlayer, handlePlayerPassed, currentPlayerIndex}) =>{

    return(
        <>
            <div className="panel">
                <div className="menu">
                    <CustomButton name={'Начать новую игру'} onClick={handleStartGame}/>
                </div>
                <div className="buttons">
                    {
                        gameStart && // отображаем кнопки при начале игры
                        <>
                            <div className="current-player">
                                Ходит: Player {currentPlayerIndex+1}
                            </div>

                            <div className="buttons__control">
                                <CustomButton  name={'Взять'} onClick={handleAddCardToPlayer} />
                                <CustomButton  name={'Пас'} onClick={handlePlayerPassed}/>
                            </div>
                        </>
                    }

                </div>
            </div>
        </>
    )
}

export {Panel}