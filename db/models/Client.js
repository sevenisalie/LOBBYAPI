const mongoose = require("mongoose")
const {fetchSummaryForKeyword, fetchAllClientNames} = require("../../data/wiki")


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
async function insertDocumentsInBatches(documents, batchSize) {
    const numBatches = Math.ceil(documents.length / batchSize);
    for (let i = 0; i < numBatches - 1; i++) {
      const startIndex = i * batchSize;
      const endIndex = startIndex + batchSize;
      const batch = documents.slice(startIndex, endIndex);
  
      try {
        await Client.insertMany(batch);
      } catch (error) {
        console.error(error);
      }
    }
  
    // insert the final batch separately
    const startIndex = (numBatches - 1) * batchSize;
    const finalBatch = documents.slice(startIndex);
    try {
      await Client.insertMany(finalBatch);
    } catch (error) {
      console.error(error);
    }
  }

const createClient = async (_cleanedDataChunk) => {

    try {
        console.log("CREATE CLIENT LENGTH")
        const templist = []
        for (let i = 0; i < 20; i++) {
            const element = _cleanedDataChunk[i];
            templist.push(element)
        }
      

        const clients = await fetchAllClientsDescriptions(_cleanedDataChunk)
        const mongoObject = clients.map( (item) => {
            return {...item}
        })
 
        const data = await insertDocumentsInBatches(mongoObject, 500)
        return true
    } catch (err) {
        console.log(Object.keys(err))
        console.log(err.insertedDocs)
        console.log(err.code)
        console.log(err.codeName)
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

    const keywords = await fetchAllClientNames(clients)

    const mappedPromises = keywords.map( (keyword) => {
        return fetchSummaryForKeyword(keyword)
    })
    const results = await Promise.all(mappedPromises)

    //merge back into data
    const mergedData = clients.map( (client, index) => {
        return {
            ...client,
            wiki: results[index]
        }
    })

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