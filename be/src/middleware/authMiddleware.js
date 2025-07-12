import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req,res,next) => {
    const authHeader =req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({'error':'Unauthorized'})
    }

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, "secret" )
        req.userId = decoded.id;
        next()
    }catch(e){
        return res.status(403).json({
            message:"Not logged in"
        })
    }
}

export default authMiddleware;