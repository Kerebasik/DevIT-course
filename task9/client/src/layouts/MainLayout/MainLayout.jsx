import React from "react";
import {Outlet} from "react-router-dom";
import './MainLayout.style.scss'

const MainLayout = () =>{
    return(
        <>
            <div className={'mainLayout'}>
                <Outlet/>
            </div>
        </>
    )
}

export {MainLayout}