
const endpoints = require('../endpoints.json')
exports.invalidPath = (req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
}

exports.getEndpoints = (req, res, next) => {
          res.status(200).send({endpoints})  
}