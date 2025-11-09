import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/User.interface";

const userSchema:mongoose.Schema = new Schema({
    name:{
        type:String, 
        require:true,
        trim: true
    },
    email:{
        type:String, 
        require:true,
        trim: true,
        unique:true
    },
    password:{
        type:String, 
        require:true,
        trim: true
    },
    handle:{
        type:String, 
        require:true,
        trim: true,
        lowercase:true, 
        unique: true
    },
    description: {
        type: String, 
        default: ''
    },
    image:{
        type: String, 
        default: ''
    },
    links:{
        type:String,
        default: '[]'
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User
