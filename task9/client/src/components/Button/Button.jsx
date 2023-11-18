import React from "react";
import './Button.style.scss'

const Button = ({children, handleOnClick=()=>{}, type='button', disabled=false}) => {
    return(
        <button disabled={disabled} type={type} className={'customButton'} onClick={handleOnClick}>
            {children}
        </button>
    )
}

export {Button}