const mongoose = require("mongoose")

const URI = process.env.MONGODB_URL
mongoose.connect(URI)

module.exports = {
    mongoose
}