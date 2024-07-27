import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import cors  from 'cors'

const app = express()
app.use(cors());

import mongoose from 'mongoose'

mongoose.connect(process.env.DATABASE_URL)



const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.use(express.json())

// const trialRouter = require('./routes/apiTrial')
import router from './routes/apiTrial.js'
app.use('/apiTrial', router)


app.listen(3000, () => console.log("Server Started"))