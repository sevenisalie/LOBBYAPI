const { response } = require("express")
const axios = require("axios")
const mongoose = require("mongoose")
const fs = require("fs")
const { createClient } = require("../db/index")
require('dotenv').config()

const fetchClientData = async (_url) => {
    const response = await axios.get(
        _url,
        {
            headers: {
                "Authorization": `Token ${process.env.LDAAPIKEY}`
            }
        }
    )
    return response.data
}

const cleanMappedResults = (_mappedResults) => {
    let mergedData = _mappedResults.reduce( (previous, current) => {
        return [...previous, ...current]
    }, [])
    return mergedData
}

const createClientPromises = async () => {
    const initialURL = `https://lda.senate.gov/api/v1/clients?client_state=NE&page=${1}`
    const initialResponseData = await fetchClientData(initialURL)
    const count = initialResponseData.count
    const maxPages = Math.floor(count / 25) + 1
    const mappedPromises = Array(maxPages).fill(count).map( (count, index) => {
        const page = index + 1
        const url = `https://lda.senate.gov/api/v1/clients?client_state=NE&page=${page}`
        const responsePromise = axios.get(
            url,
            {
                headers: {
                    "Authorization": `Token ${process.env.LDAAPIKEY}`
                }
            }
        )
        return responsePromise
    })

    const resolvedPromises = await Promise.all(mappedPromises)
    const mappedResults = resolvedPromises.map( (result) => {
        return result.data.results
    })

    const cleanedResults = cleanMappedResults(mappedResults)
    return cleanedResults
}

const saveClientListDatabase = async (clientData) => {
    //1 is connected, 0 is disconnected
    if (mongoose.connection.readyState === 1) {
        await createClient(clientData)
    }
}

const iteratePageAndSave = async () => {
    const data = await createClientPromises()
    // const stringData = JSON.stringify(data, null, 2)
    //     fs.writeFile(`./data/clients.json`, stringData, (err) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     console.log("succ save")
    // })
    const database = await saveClientListDatabase(data)
    return data
}



module.exports = {
    iteratePageAndSave,
}