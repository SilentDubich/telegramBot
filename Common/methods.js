module.exports = {
    findByQuery: (objectToFind, query = {}) => {
        return objectToFind.find(query)
    },
    sendHtml: () => {
        return '<br></br>'
    }
}