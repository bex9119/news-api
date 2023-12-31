exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'Internal Server Error'})
}

exports.handleCustomeErrors = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    }
    else next(err)
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if(err.code === '22P02'|| err.code === '42703' || err.code === '23502' || err.code === '42601') {
        res.status(400).send({msg: 'Bad Request'})
    }
    else if( err.code === '23503' ) {
        res.status(404).send({msg: 'Not Found'})
    }
    else next(err)
}