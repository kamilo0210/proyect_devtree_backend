import User from "../models/User"
import {Request} from 'express'
import { checkPassword, hashPassword } from "../utils/auths"
import slugPkg from 'slug';
const slug = (slugPkg as any).default || slugPkg;

import { generateJWT } from "../utils/jwt"


export const createAccount = async (req:Request, res:any) =>{
   

    const {email, password} = req.body
    const userExists = await User.findOne({email})
    
    if(userExists){
     const error = new Error("Un usuario con ese email ya esta registrado")
      return res.status(409).json({error: error.message})
    }
    
    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({handle})
    if(handleExists){
     const error = new Error("Nombre de usuario no disponible")
      return res.status(400).json({error: error.message})
    }

    const user = new User(req.body)
    user.handle = handle
    user.password = await hashPassword(password)

    await user.save()

    res.status(201).send('Registro creado correctamente')

}

export const login = async (req:Request, res:any) => {
    
    const {email, password} = req.body
    const user = await User.findOne({email})
    
    //Revisar si el usuario esta registrado
    if(!user){
        const error = new Error("El usuario ingresado no esta registrado")
         return res.status(404).json({error:error.message})
     }

    //Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if(!isPasswordCorrect){
        const error = new Error("Contraseña incorrecta")
        return res.status(401).json({error:error.message})
    }
    const token = generateJWT({id:user._id})
    res.status(200).send(token)
    

}


export const getUser = async  (req:Request, res:any) => {
    res.json(req.user)
}
