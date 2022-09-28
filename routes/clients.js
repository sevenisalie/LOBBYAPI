const express = require("express")
const axios = require("axios")
const router = express.Router()
require('dotenv').config()

const fetchClientData = async () => {
    const response = await axios.get(
        `https://lda.senate.gov/api/v1/clients/`,
        {
            headers: {
                "Authorization": `Token ${process.env.LDAAPIKEY}`
            }
        }
    )
    console.log(response.data)
    return response.data
}

router.get("/", async (req, res) => {
    const data = await fetchClientData()
    const message = "Succ"
    res.status(200)
    res.json({
        message: message,
        data: data
    })
})

module.exports = [
    router
]