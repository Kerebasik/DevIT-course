import React from "react";
import './Button.style.scss'

const CustomButton = ({name, onClick})  =>{
    return(
        <div className={'custom-button'}>
            <button onClick={onClick}>{name}</button>
        </div>
    )
}

export { CustomButton }