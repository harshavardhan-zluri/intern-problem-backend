require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)



const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.use(express.json())

const trialRouter = require('./routes/apiTrial')
app.use('/apiTrial', trialRouter)


app.listen(3000, () => console.log("Server Started"))