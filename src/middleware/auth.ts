import { Request, NextFunction } from "express"
import User from "../models/User"
import jwt from "jsonwebtoken"
import { IUser } from "../interfaces/User.interface"

declare global {
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}

export const authtenticate = async(req:Request, res, next:NextFunction) =>{
    const bearer = req.headers.authorization

    if(!bearer) {
        const error = new Error ("No autorizado")
        return res.status(401).json({error:error.message})
    }

    const [, token] = bearer.split(' ')

    if(!token) {
        const error = new Error ("No autorizado")
        return res.status(401).json({error:error.message})
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password')
            if(!user){
                const error = new Error ("El usuario no existe")
                return res.status(404).json({error:error.message})
            }
            req.user = user
            next()
        }
    } catch (error) {
        res.status(500).json({error:"Token no valido"})
    }
}