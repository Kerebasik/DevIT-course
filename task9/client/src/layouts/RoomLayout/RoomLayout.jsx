import React from "react";
import {Outlet} from "react-router-dom";
import './RoomLayout.style.scss'

const RoomLayout = ()=>{
    return(
        <div className={'roomLayout'}>
            <Outlet/>
        </div>
    )
}

export {RoomLayout}