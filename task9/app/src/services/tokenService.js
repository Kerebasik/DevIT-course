import jwt from "jsonwebtoken";

const secretKey = process.env.ACCESS_TOKEN_SIGNATURE

class TokenService {
    static generateToken(payload){
       return jwt.sign(payload, `${secretKey}`, { expiresIn: '15m' });
    }

    static getPayloadFromToken(token){
        return jwt.verify(token,`${secretKey}`)
    }
}

export {TokenService}