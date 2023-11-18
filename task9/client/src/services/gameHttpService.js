import {axiosInstance} from "../http/axiosInstance";

class GameHttpService {
    static createGame = () =>{
        return axiosInstance.post('/new-game')
            .then((response) => {
                return response.data
            })
    }

    static joinGame = (roomId) =>{
        return axiosInstance.post('/join-game',{roomId})
            .then((response)=>{
                return response.data
            })
    }

    static readyToGame = () =>{
        return axiosInstance.post('/ready-to-game')
            .then((response)=>{
                return response.data
            })
    }

    static getGame = () =>{
        return axiosInstance.post('/game')
            .then((response)=>{
                return response.data
            })
    }

    static playerTurn = (playerTurn) =>{
        return axiosInstance.post(`/turn?action=${playerTurn}`)
            .then((response)=>{
                return response.data
            })
    }
}

export {GameHttpService}