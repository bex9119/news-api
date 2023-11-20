exports.controllerSetUp = (req, res, next) => {
    res.status(200).send({msg: 'Connected!'})
}

exports.invalidPath = (req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
}