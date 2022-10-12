const mongoose = require("mongoose")
require('dotenv').config()

const connect = async () => {
    try {
        const URI = process.env.MONGODB_URL
        await mongoose.connect(URI)
        const db = mongoose.connection
        db.once('open', () => {
            console.log("Connected to MongoDB Remote DB")
          })
        return db
    } catch (err) {
        console.log(err)
        return null
    }
}
module.exports = {
    connect
}