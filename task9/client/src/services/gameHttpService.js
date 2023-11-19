import {axiosInstance} from "../http/axiosInstance";

class GameHttpService {
    static createGame = async () =>{
        try {
            const response = await axiosInstance.post('/new-game')
            return response.data
        } catch (e) {
            return e
        }
    }

    static joinGame = async (roomId) =>{
        try {
            const response = await axiosInstance.post('/join-game',{roomId})
            return response.data
        } catch (e) {
            return e
        }
    }

    static readyToGame = async () =>{
        try {
            const response = await axiosInstance.post('/ready-to-game')
            return response.data
        } catch (e) {
            return e
        }
    }

    static getGame = async () =>{
        try {
            const response = await axiosInstance.post('/game')
            return response.data
        } catch (e) {
            return e
        }
    }

    static playerTurn = async (playerTurn) =>{
        try {
            const response = await axiosInstance.post(`/turn?action=${playerTurn}`)
            return response.data
        } catch (e) {
            return e
        }
    }
}

export {GameHttpService}