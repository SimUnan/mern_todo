import jwt from 'jsonwebtoken'
import {createError} from '../utils/createError.js'

export const checkAuth = (req, res, next) => {
    //request token
    const token = req.cookies.__cf_bm);
    if(!token){
        return next(createError({status: 401, message: "Unauthorized."}));
    }
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return next((createError({status: 400, message: "Invalid token."})))
        }else{
            req.user = decoded;
            return next();
        }
    });
};
