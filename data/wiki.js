const wiki = require('wikijs').default

const fetchAllClientNames = async (_clientList) => {
    const names = _clientList.map( (client) => {
        return client.name
    })
    return names
}

const fetchWikiData = async (textQuery) => {
    try {
        const page = await wiki().page(textQuery)
        return page
    } catch (err) {return null}
}

const searchWikiPedia = async (textQuery) => {
    try {} catch (err) {return null}
    const query = await wiki().search(textQuery)
    return query.results[0]
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

module.exports = {
    fetchSummaryForKeyword,
    fetchAllClientNames
}