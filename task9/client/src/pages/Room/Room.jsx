import React from "react";
import {PlayersList} from "../../components/PlayersList/PlayersList";
import {Panel} from "../../components/Panel/Panel";
import './Room.style.scss'

const Room = ()=>{
    return(
        <div className={'black-jack-table'}>
            <PlayersList/>
            <Panel/>
        </div>
    )
}

export {Room}