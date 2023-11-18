import React from "react";
import './Title.style.scss'

const Title = ({children, size= 36})=>{
    const sizeMap = new Map([
        [108,'size-108'],
        [36,'size-36'],
        [18, 'size-18']
    ])

    return(
        <h1 className={`title ${sizeMap.get(size)}`}>
            {children}
        </h1>
    )
}

export {Title}