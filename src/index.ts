 //ESModules
import colors  from 'colors'
import app from './server'
// const express = require('express')  Commonjs

/**
 * Ese env.PORT es una variable de entorno que usando los hosting
 * esta hace referencia al puerto que este libre para el despliegue 
 * de la aplicacion, si no hay una como en mi computadora usare
 * el puerto 4000
 */
const port:string|number = process.env.PORT || 4000 

app.listen(port, () => {
    console.log( colors.blue.bold (`Servidor funcionando en el puerto ${port}`))
})