const express = require("express")
const axios = require("axios")
const router = express.Router()
const fs = require("fs")
require('dotenv').config()
const mongoose = require("mongoose")
const { states } = require("../constants")
const { iteratePageAndSave } = require("../data/clients")
const { fetchAllClients, fetchAllClientsDescriptions } = require("../db/models/Client")
const { generalTextSearch, getClientNamesByState } = require("../db/models/queries")

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

router.get("/state", async (req, res) => {
    console.log(req)
    if (req.query.state === null) {
        res.status(400)
        return res.json({
            message: "Enter a state ID"
        })
    }
    const stateCodes = states.map( (state) => {
        return state.value
    })
    if (stateCodes.includes(req.query.state) === false) {
        res.status(400)
        return res.json({
            message: "Enter a valid State ID",
            data: stateCodes
        })
    }

    const data = await getClientNamesByState(req.query.state)
    if (data) {
        res.status(200)
        return res.json({
            message: "succ",
            data: data
        })
    }

    //complete failure
    res.status(500)
    res.json({
        message: "nothing happened"
    })
})

router.get("/search", async (req, res) => {
    if (req.query.query === null) {
        res.status(400)
        return res.json({
            message: "Please Enter A Query"
        })
    }

    const query = req.query.query
    const response = await generalTextSearch(query)
    if (response) {
        res.status(200)
        return res.json({
            message: "succ",
            data: response
        })
    }
    res.status(500)
    return res.json({
        message: "nothing happened"
    })
})
//tests
router.get("/descriptions", async (req, res) => {
    try {
        const descriptions = await fetchAllClientsDescriptions()
        res.status(200)
        return res.json({
            status: "succ",
            data: descriptions
        })
    } catch (err) {
        res.status(400)
        return res.json({
            status: "fuck"
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