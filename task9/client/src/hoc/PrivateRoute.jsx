import React from "react";
import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router-dom";
import {Router} from "../constants/router";


const PrivateRoute = ({children})=>{
    const {auth} = useAuth()

    if(auth){
        return <>{children}</>
    }

    return <Navigate to={Router.ROOT}/>
}

export {PrivateRoute}