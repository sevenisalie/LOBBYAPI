const { response } = require("express")
const axios = require("axios")
const fs = require("fs")
const mongoose = require("mongoose")
const {fetchAllClients} = require("../db/models/Client.js")
const wiki = require('wikijs').default
require('dotenv').config()



const createClientElasticSchema = (bodyObject) => {
    if (!bodyObject.id) {return}
    const elasticSchema = {
        index: "clients",
        body: bodyObject
    }
    return elasticSchema
}

const createSavePromises = () => {
    var icount = 0
    const mappedClients = data.map( (client) => {
        icount ++
        return client
    })
    console.log(icount)
    return mappedClients
}

const fetchWikiData = async (textQuery) => {
    try {
        const page = await wiki().page(textQuery)
        // console.log(await page.summary())
        return page
    } catch (err) {return null}
}

const searchWikiPedia = async (textQuery) => {
    try {} catch (err) {return null}
    const query = await wiki().search(textQuery)
    return query.results[0]
}

const fetchAllClientNames = async (_clientList) => {
    const names = _clientList.map( (client) => {
        return client.name
    })
    return names
}
//main
const fetchSummaryForKeyword = async (_keyword) => {
    try {
        const query = await searchWikiPedia(_keyword)
        if (query === null) {return null}
        const page = await fetchWikiData(query)
        const summary = await page.summary()
        return summary
    } catch (err) {return null}
}


const main = async () => {
    console.log("hello")
    try {
    console.log("POOP LOOP")
    const data = await fetchAllClients()
    console.log(data)
    return data
    } catch (err) {
        console.log(err)
        return console.log("fail")
    }

    return
}

