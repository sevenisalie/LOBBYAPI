const express = require("express")
const axios = require("axios")
const router = express.Router()
const fs = require("fs")
require('dotenv').config()
const mongoose = require("mongoose")
const { states } = require("../constants")
const { iteratePageAndSave } = require("../data/clients")
const { fetchAllClients } = require("../db/models/Client")

//CRUD
const fetchClientData = async (_url) => {
    try {
        const response = await axios.get(
            _url,
            {
                headers: {
                    "Authorization": `Token ${process.env.LDAAPIKEY}`
                }
            }
        )
        return response.data
    } catch (err) {
        console.log(err)
    }
    
}

const saveClientData = async () => {
    try {
        await iteratePageAndSave()
    } catch (err) {console.log(err)}

}

//crud
//get all clients from mongodb
router.get("/", async (req, res) => {
    try {
        const data = await fetchAllClients()
        res.status(200)
        return res.json({
            message: "succ",
            data: data
        })
    } catch (err) {
        console.log(err)
        return res.json({
            message: "fail",
            data: err
        })
    }
})

router.post("/saveClients", async (req, res) => {
    try {
        const data = await saveClientData()
        const message = "Succ"
        res.status(200)
        return res.json({
            message: message,
            data: data
        })
        
    } catch (err) {
        res.status(400)
        return res.json({
            message: "Fail",
            data: err
        })
    }
})

module.exports = [
    router
]