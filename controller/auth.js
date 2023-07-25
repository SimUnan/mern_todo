import User from '../model/User.js'
import {createError} from '../utils/createError.js'

import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async(req, res, next) => {
    try {
        //req input 
        const {name, email, password} = req.body;

        //if we dont get the input (show err)
        if(!name || !email || !password){
            return next(createError({status: 400, message: "All fleids are required!"}));
        }
        
        //check if user exit or not by email
        const chkUser = await User.findOne({email});
        //if user exit == false register
        if(chkUser){
            return next(createError({status: 400, message: "Email have been used."}));
        }

        //hash the password (ofc we dont want to store our customer as a text)
        const salt = await bcryptjs.genSalt(10); 
        const hashedPassword = await bcryptjs.hash(password, salt);

        //save new user input DB 
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        })
            //save user
        await newUser.save();

        //return the json if process is succeeed
        return next(createError({status: 200, message: "New user added."}))

    }catch(err) {
        console.log(err)
        return next(err);
    }
};


//login api
export const login = async(req, res, next) => {
    try{
        //i do (name or email) with pw
        const {email, password} = req.body;

        //check if we have input or not
        if(!email || !password){
            return next(createError({status: 400, message: "All fleids are required!"}));
        }

        //check if that user exits in DB or not 
        const exitedUser = await User.findOne({email});
        if(!exitedUser){
            return next(createError({status: 404, message: "no user in database."}))
        }

        const comparePassword = await bcryptjs.compare(password, exitedUser.password);
        if(!comparePassword){
            return next(createError({status: 400, message: "Wrong password."}));
        }

        //sign up token 
            //payload for jwt 
            const payload = {
                id: exitedUser._id,
            }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1 day"
        });
        //set up cookie(httpOnly)
        res.cookies("access_token", token, {
            httpOnly: true,
            secure: true
        })
        .json({message: "login success."});

    }catch(err){
        console.log(err)
        return next();
    }
} 


//logout 
export const logout = async(req, res) => {
    res.clearCookie('access_token');
    return res.status(200).json({message: "logout success."});
}


//is_logged_in for frontend 
export const isLoggedIn = async(req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return res.json(false);
    }
    return jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if(err){
            return res.json(false)
        }
        return res.json(true);
    })
}
