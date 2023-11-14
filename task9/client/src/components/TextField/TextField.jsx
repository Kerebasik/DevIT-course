import React from "react";


import './TextField.style.scss'

const TextField = ({value, placeholder, error= false, helperText = '', onChange=()=>{}, type='text'})=>{
    return(
        <div className={'textField__wrapper'}>
            <div className={error ? 'textField__input_error'  : 'textField__input' }>
                <input type={type} className={'textField'} onChange={onChange} placeholder={placeholder} value={value}/>
            </div>
            {
                helperText && <p className={error ? 'helperText_error' : 'helperText'}>{helperText}</p>
            }
        </div>
    )
}

export {TextField}