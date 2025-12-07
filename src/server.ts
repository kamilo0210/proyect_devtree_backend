import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

const app = express()

connectDB()

//Cors
app.use(cors(corsConfig))

//leer datos de formulario 
app.use(express.json())

//Routing
app.use('/', router)


export default app