const express = require("express")
const cors = require("cors")

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