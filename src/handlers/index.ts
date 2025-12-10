import User from "../models/User"
import {Request} from 'express'
import { checkPassword, hashPassword } from "../utils/auths"
import slug from 'slug'
import {v4 as uuid} from 'uuid';
import { generateJWT } from "../utils/jwt"
import formidable from 'formidable';
import cloudinary from "../config/cloudinary"


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

export const upadteUser = async (req:Request, res:any) => {


  try {

    const {description, links} = req.body
    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({handle})
    if(handleExists  && handleExists.email != req.user.email){
     const error = new Error("Nombre de usuario no disponible")
      return res.status(400).json({error: error.message})
    }
    
    //Actualizar el usuario 
    req.user.description = description
    req.user.handle = handle
    req.user.links = links
    await req.user.save()
    res.send("Perfil actualizado correctamente")

  } catch (e) {
    const error = new Error("Hubo un error")
    return res.status(500).json({error:error.message})
  }

    
}


export const uploadImage = async (req:Request, res:any) => {
  const form = formidable({multiples:false})
   
  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(files.file[0].filepath, {public_id:uuid()}, async(error, result) => {
        if(error){
          const error = new Error("Hubo un error al subir la imagen")
          return res.status(500).json({error:error.message})
        }if(result){
          req.user.image = result.secure_url
          await req.user.save()
          res.status(200).json({image: result.secure_url})
        }
       
      })
    })

  } catch (e) {
    const error = new Error("Hubo un error")
    return res.status(500).json({error:error.message})
  }
}


export const getUserByHandle = async (req:Request, res:any) => {

  try {
    const {handle} = req.params
    const user = await User.findOne({handle}).select('-_id -__v -email -password')
    if(!user){
      const error = new Error('El usuario no existe');
      return res.status(400).json({error: error.message})
    }
    res.json(user)
    

  } catch (e) {
    const error = new Error("Hubo un error")
    return res.status(500).json({error:error.message})
  }

}

export const searchByHandle = async (req:Request, res:any) => {
  const {handle} = req.body
  try{
    const userExist = await User.findOne({handle})
    if(userExist){
      const error = new Error(`${handle} ya esta registrado`)
      return res.status(409).json({error: error.message})
    }

    res.send(`${handle} esta disponible`)

  } catch (e) {
    const error = new Error("Hubo un error")
    return res.status(500).json({error:error.message})
  }
}