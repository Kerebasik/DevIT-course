const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }


}

export {authMiddleware}