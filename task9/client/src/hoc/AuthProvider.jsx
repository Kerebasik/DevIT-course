import React from "react";
import {createContext, useState} from "react";
import {LocalStorageService} from "../services/storageService";
import {localStorageKeys} from "../constants/storageKey";

const initialContext = {
    auth:false,
    login:()=>{},
    logout:()=>{}
}

export const AuthContext = createContext(initialContext)

export const AuthProvider = ({children}) =>{
    const [auth, setAuth] = useState(!!LocalStorageService.getItem(localStorageKeys.accessToken))

    const login = ()=> {
        setAuth(true)
    }

    const logout = () => {
        setAuth(false)
        LocalStorageService.removeItem(localStorageKeys.accessToken)
    }

    const context = {auth, login, logout}

    return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

