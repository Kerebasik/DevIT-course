import jwt from "jsonwebtoken";


const secretKey = process.env.ACCESS_TOKEN_SIGNATURE

const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers?.authorization.split(' ')[1]

        if(!token){
            return res.status(401).json({message:"Токен отсутствует"})
        }

        const  decode = jwt.verify(token,`${secretKey}`)

        req.userId = decode.userId;
        req.roomId = decode.roomId;

        return next()
    } catch (e){
        console.log(e)
        return res.status(401).json({ message: "Ошибка аутентификации" });
    }
}

export {authMiddleware}