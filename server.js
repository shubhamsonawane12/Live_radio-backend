import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
// import useRoutes  from "./routes/users.routes" ;
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/user.auth.js"
const app = express();

 app.use(cors ({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
 }))
app.use(express.json({limit:"16kb"}))
app.use (express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api/auth', authRoutes);

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    try{
        app.on("error",(error)=>{
            console.log("Error",error);
            throw error
        })
        app.listen(process.env.PORT||3000,()=>{
            console.log(`server is running on port ${process.env.PORT}`);
        })

    }
    catch(error){
    console.log("port listening failed ",error);
    }
})
.catch ((error)=>{
    console.log("mongodb connection failed",error);
})


