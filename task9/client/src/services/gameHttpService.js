import {axiosInstance} from "../http/axiosInstance";

class GameHttpService {
    static createGame = () =>{
        return axiosInstance.post('/new-game')
            .then((response) => {
                return response.data
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    static joinGame = (roomId) =>{
        return axiosInstance.post('/join-game',{roomId})
            .then((response)=>{
                return response.data
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    static getGame = () =>{
        return axiosInstance.post('/game')
            .then((response)=>{
                return response.data
            })
    }
}

export {GameHttpService}