const fs = require('fs/promises')

exports.readEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((response) => {
        const endpointResponse = JSON.parse(response)
        return endpointResponse
    })
}