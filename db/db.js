import mongoose from 'mongoose'
import {DB_NAME} from "../constants.js";

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            dbName:DB_NAME,
        });
        console.log(`\n Mongodb connect !! DB HOST: ${mongoose.connection.host}`)

    }catch(error){
        console.error("MONGODB connection failed",error);
        process.exit(1)

    }
}
export  default connectDB;