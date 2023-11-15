import axios from "axios";
import {LocalStorageService} from "../services/storageService";
import {localStorageKeys} from "../constants/storageKey";

const axiosInstance = axios.create({
    baseURL:'http://localhost:3000/api'
})

axiosInstance.interceptors.request.use((config)=>{
    if(!!LocalStorageService.getItem(localStorageKeys.accessToken)){
        config.headers['Authorization'] = `Bearer ${LocalStorageService.getItem(localStorageKeys.accessToken)}`;
    }
    return config
},(error)=>{
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use((config)=>{
    if(!!config.data.accessToken){
        LocalStorageService.setItem(localStorageKeys.accessToken, config.data.accessToken)
    }
    return config
})

export { axiosInstance }