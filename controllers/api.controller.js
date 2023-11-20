const { readEndpoints } = require("../models/api.model")

exports.invalidPath = (req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
}

exports.getEndpoints = (req, res, next) => {
    readEndpoints()
    .then((endpoints) => {
          res.status(200).send({endpoints})  
    })



}