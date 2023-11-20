import React from "react";
import './Title.style.scss'

const Title = ({children, size= 36})=>{

    return(
        <h1 className={`title size-${size}`}>
            {children}
        </h1>
    )
}

export {Title}