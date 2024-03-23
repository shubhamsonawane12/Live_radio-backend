import mongoose from "mongoose";

const userSchema= new mongoose.Schema ({
    username:{
        type: String,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    email:{
        type:String,
        required:true,
        index:true,
        unique:true
    },
    fullName:{
        type:String,
        trim:true,
        index:true
    },
    favoriteChannels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RadioChannel'
    }]
},{timestamps:true});

export const User = mongoose.model("User",userSchema);
