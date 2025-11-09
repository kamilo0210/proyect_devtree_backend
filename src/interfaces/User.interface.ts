import {Document} from 'mongoose'

export interface IUser extends Document {
    handle:string
    name:string, 
    email:string, 
    password:string,
    description?: string,
    image: string,
    links:string
}