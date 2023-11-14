import React from "react";
import './Button.style.scss'

const Button = ({children, handleOnClick=()=>{}, type='button'}) => {
    return(
        <button type={type} className={'customButton'} onClick={handleOnClick}>
            {children}
        </button>
    )
}

export {Button}