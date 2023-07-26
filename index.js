import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import morgan from "morgan";

import allRoutes from './routes/index.js'

const PORT = process.env.PORT || 8000;
const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(cors({credentials: true}));
app.use(morgan('tiny'));
app.use(cookieParser());  



//setup route
app.use('/api', allRoutes)


//error handler
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal server error.";

    return res.status(status).json({message, stack: err.stack});
})


//connect DB 
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log(`mongoDB connected.`)
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}




//server starter
app.listen(PORT, () => {
    connectDB();
    console.log(`server running on http://localhost:${PORT}`)
});

