const { response } = require("express")
const clientData = require("./clients.json")
const axios = require("axios")
const fs = require("fs")
require('dotenv').config()
const data = clientData.results
var count = 0
var maxPage = 1




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


const main = async () => {
    const testfireandwait = await iteratePageAndSave()
    console.log("MERGED RESULTS")
    console.log(testfireandwait.length)
    return
}
main()
