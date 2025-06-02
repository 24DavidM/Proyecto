//
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

// INICIAMOS

const app = express()
dotenv.config()

// CONFIGURAMOS

app.set('port', process.env.port || 3000)
app.use(cors())

//MIDDLEWARES
app.use(express.json())



//rutas

app.get('/',(req,res)=>{
    res.send("Server on")
})

export default app
