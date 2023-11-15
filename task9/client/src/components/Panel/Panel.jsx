import React from "react";


import './Panel.style.scss'
import {Button} from "../Button/Button";
import {Title} from "../Title/Title";
import {useSelector} from "react-redux";

const Panel = ()=>{
    const {game} = useSelector(state => state.gameReducer)
    return(
        <div className="panel">
            <Button>Готов</Button>
            <div>
                <Title>Игроков готово 0/2</Title>
                <Title>Ходит игрок: Player {game?.currentPlayerIndex+1}</Title>

            </div>

            <div>
                <Button> Взять карту </Button>
                <Button> Пасс </Button>
            </div>
        </div>
    )
}

export {Panel}