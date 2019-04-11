require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/classic_fox_live_code_1', { useNewUrlParser: true })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/', routes)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})