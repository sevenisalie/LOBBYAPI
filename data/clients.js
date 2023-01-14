const { response } = require("express")
const axios = require("axios")
const mongoose = require("mongoose")
const fs = require("fs")
const { createClient } = require("../db/index")
const { states } = require("../constants")
const Promise = require("bluebird")
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

const getClientsForState = async (state) => {
    const results = [];
    const failedRequests = [];
  
    const initialURL = `https://lda.senate.gov/api/v1/clients?client_state=${state}&page=1`;
    const initialResponseData = await fetchClientData(initialURL);
    const count = initialResponseData.count;
    const maxPages = Math.floor(count / 25) + 1;
  
    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      const url = `https://lda.senate.gov/api/v1/clients?client_state=${state}&page=${pageNumber}`;
      try {
        setTimeout(() => {
            console.log("*")
        }, 1000 * 2)
        const response = await axios.get(
            url,
                {
            headers: {
                "Authorization": `Token ${process.env.LDAAPIKEY}`
            }
        });
        const clients = response.data.results;
        results.push(clients);
      } catch (error) {
        console.log(error)
        failedRequests.push(url);
      }
    }
    console.log(failedRequests)
    const cleanedResults = cleanMappedResults(results)
    return cleanedResults
}
  
const createClientPromises = async (_state) => {
    const initialURL = `https://lda.senate.gov/api/v1/clients?client_state=${_state}&page=${1}`
    const initialResponseData = await fetchClientData(initialURL)
    const count = initialResponseData.count
    const maxPages = Math.floor(count / 25) + 1
    // const mappedPromises = Array(maxPages).fill(count).map( (count, index) => {
    //     const page = index + 1
    //     const url = `https://lda.senate.gov/api/v1/clients?client_state=${_state}&page=${page}`
    //     const responsePromise = axios.get(
    //         url,
    //         {
    //             headers: {
    //                 "Authorization": `Token ${process.env.LDAAPIKEY}`
    //             }
    //         }
    //     )
    //     return responsePromise
    // })

    // const resolvedPromises = await Promise.all(mappedPromises)

    const requests = Array(maxPages).fill(count).map( (count, index) => {
        const page = index + 1
        const url = `https://lda.senate.gov/api/v1/clients?client_state=${_state}&page=${page}`
        return url
    })
    const resolvedPromises = await Promise.map(
        requests,
        (url) => {
            const responsePromise = axios.get(
                url,
                {
                    headers: {
                        "Authorization": `Token ${process.env.LDAAPIKEY}`
                    }
                }
            )
            return responsePromise
        }
    )
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
    // const stateErrorCache=[]
    // const statePromises = await Promise.map(
    //     states, 
    //     async (state) => {
    //         try {
    //             const data = await createClientPromises(state.value)
    //             const database = await saveClientListDatabase(data)
    //             return database
    //         } catch (err) {
    //             console.log(err)
    //             stateErrorCache.push(state)
    //         }

    //     })
    // console.log(stateErrorCache)
    // console.log(stateErrorCache.length)
    // return statePromises

    const data = await getClientsForState(states[50].value)
    try {
        const database = await saveClientListDatabase(data)
        return database
    } catch (err) {console.log(err)}
}

module.exports = {
    iteratePageAndSave,
}