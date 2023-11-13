import React from "react";
import { CustomButton } from "../Button/Button";
import './Panel.style.scss'

const Panel = ({gameStart, handleStartGame, handlePlayerMove, handlePlayerPass, currentPlayer}) =>{

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
                                Ходит: {currentPlayer}
                            </div>

                            <div className="buttons__control">
                                <CustomButton  name={'Взять'} onClick={handlePlayerMove} />
                                <CustomButton  name={'Пас'} onClick={handlePlayerPass}/>
                            </div>
                        </>
                    }

                </div>
            </div>
        </>
    )
}

export {Panel}