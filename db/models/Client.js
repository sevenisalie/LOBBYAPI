const mongoose = require("mongoose")
const {fetchSummaryForKeyword, fetchAllClientNames} = require("../../data/wiki")


    // console.log("MONGOOSE CONNECT IN CLIENT>JS")
    // console.log(mongoose.connection)
const db = mongoose.connection
const clientSchema = new mongoose.Schema({
    id: Number,
    url: String,
    client_id: Number,
    name: String,
    id: Number,
    url: String,
    client_id: Number,
    name: String,
    general_description: String,
    client_government_entity: Boolean,
    client_self_select: Boolean,
    state: String,
    state_display: String,
    country: String,
    country_display: String,
    ppb_state: String,
    ppb_state_display: String,
    ppb_country: String,
    ppb_country_display: String,
    effective_date: String,
    wiki: String,
    registrant: {
      id: Number,
      url: String,
      house_registrant_id: Number,
      name: String,
      description: String,
      address_1: String,
      address_2: String,
      address_3: String,
      address_4: String,
      city: String,
      state: String,
      state_display: String,
      zip: String,
      country: String,
      country_display: String,
      ppb_country: String,
      ppb_country_display: String,
      contact_name: String,
      contact_telephone: String,
      dt_updated: String
    }
})

const Client = mongoose.model("Client", clientSchema)

//CRUD

const createClient = async (_cleanedDataChunk) => {

    try {
        console.log("CREATE CLIENT LENGTH")
        // console.log(_cleanedDataChunk[8])
        const templist = []
        for (let i = 0; i < 20; i++) {
            const element = _cleanedDataChunk[i];
            templist.push(element)
        }
        // console.log(templist)

        console.log(_cleanedDataChunk.length)
        const clients = await fetchAllClientsDescriptions(_cleanedDataChunk)
        const mongoObject = clients.map( (item) => {
            return {...item}
        })
        console.log(mongoObject.length)
        console.log(typeof templist)
        await Client.insertMany(mongoObject)
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

const fetchAllClients = async () => {
    try {
        const clientList = await Client.find({})
        return clientList
    } catch (err) {
        console.log(err)
        return err
    }
}
//expiremental wikishit
const fetchAllClientsDescriptions = async (_clientList) => {
    try {
    const clients = _clientList
    console.log("ALL CLIENTS SUCC")
    console.log(Object.keys(clients[0]))
    const keywords = await fetchAllClientNames(clients)
    console.log("CLIENT NAMES SUCC")
    console.log(keywords)
    const mappedPromises = keywords.map( (keyword) => {
        return fetchSummaryForKeyword(keyword)
    })
    const results = await Promise.all(mappedPromises)
    console.log("ALL DESCRIPTIONS COLLECTED")
    console.log(results)
    //merge back into data
    const mergedData = clients.map( (client, index) => {
        return {
            ...client,
            wiki: results[index]
        }
    })
    console.log("DATA MERGED")
    console.log(mergedData[78])
    return mergedData
    } catch (err) {return null}
}

const clientMain = () => {

    db.once('open', () => {
        console.log("Connected to MongoDB Remote DB")
      })
}

module.exports = {
    Client,
    clientMain,
    createClient,
    fetchAllClients,
    fetchAllClientsDescriptions
}