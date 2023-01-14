const {connect} = require("../connection.js") //only necessary when testing; server takes care of connection globally when running logic through router.routes()
const mongoose = require("mongoose")
const {Client} = require("./Client")


const generalTextSearch = async (_query) => {
    try {
        const aggregation = await Client.aggregate(
            [
                {
                  '$search': {
                    'index': 'default',
                    'text': {
                      'query': `${_query}`,
                      'path': {
                        'wildcard': '*'
                      }
                    }
                  }
                }
              ]
        )
        return aggregation
    } catch (err) {
        console.log(err)
        return null
    }
}

const getClientNamesByState = async (state) => {
  try {
    const pipeline = [
      {
        $match: {
          state: state,
        },
      },
      {
        $project: {
          name: 1,
          _id: 0,
        },
      },
    ];

    const clientNames = await Client.aggregate(pipeline).exec();
    return clientNames;
  } catch (error) {
    console.error(error);
  }
}

// const main = async () => {
//     const db = await connect()
//     if (db !== null) {
//         const results = await generalTextSearch("boys town")
//         const cleaned = results.map( (result) => {
//             return Object.keys(result)
//         })
//         console.log(Object.keys(results))
//     } 
// }

// main()

module.exports = {
    generalTextSearch,
    getClientNamesByState
}