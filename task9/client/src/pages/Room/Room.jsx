import React, {useEffect} from "react";
import {PlayersList} from "../../components/PlayersList/PlayersList";
import {Panel} from "../../components/Panel/Panel";
import './Room.style.scss'
import { fetchGame} from "../../store/reducers/actionCreator";
import {useNavigate} from "react-router-dom";
import {Router} from "../../constants/router";
import {useDispatch, useSelector} from "react-redux";

const Room = ()=>{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoading, error } = useSelector((state) => state.gameReducer);

    useEffect(()=>{
        dispatch(fetchGame())

    },[])

    useEffect(() => {
        if(isLoading === false && !!error){
            navigate(Router.ROOT)
        }
    }, [error, isLoading]);



    return(
        <div className={'roomLayout'}>
            <div className={'black-jack-table'}>
                <PlayersList/>
                <Panel/>
            </div>
        </div>
    )
}

export {Room}