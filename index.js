const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const {clientMain} = require("./db/models/Client.js")
require('dotenv').config()


//db
const URI = process.env.MONGODB_URL
mongoose.connect(URI)
const db = mongoose.connection

clientMain()
// db.once('open', () => {
//   console.log("Connected to database")
// })

const app = express()

app.use(cors())
app.use(express.json())

//routes
const clientsRouter = require("./routes/clients")
app.use("/clients", clientsRouter)




//conn
const port = 8042 //local
const PORT = process.env.PORT || port
const HOST = process.env.PORT ? "0.0.0.0" : "localhost"

app.listen(
    PORT,
    () => console.log(`Running on ${PORT}`)
)