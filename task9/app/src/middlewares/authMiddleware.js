import jwt from "jsonwebtoken";
import {TokenService} from "../services/tokenService.js";
import {serverStatus} from "../constants/serverStatus.js";


const secretKey = process.env.ACCESS_TOKEN_SIGNATURE

const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers?.authorization.split(' ')[1]

        if(!token){
            return res.status(serverStatus.NOT_AUTH).json({message:"Токен отсутствует"})
        }

        const decode = TokenService.getPayloadFromToken(token)

        req.userId = decode.userId;
        req.roomId = decode.roomId;

        return next()
    } catch (e){
        console.log(e)
        return res.status(serverStatus.NOT_AUTH).json({ message: "Ошибка аутентификации" });
    }
}

export {authMiddleware}