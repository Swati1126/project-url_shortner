const jwt = require("jsonwebtoken");
const bookModel = require("../model/bookModel");


const authentication = async function (req, res, next) {
    try {
        let token = req.header["x-api-key"];
        console.log(token)
        if (!token)
            return res.status(400).send({ status: false, msg: "importent header missing" })
        console.log(token)

        let decodedToken = jwt.varify(token, 'projectthreebook')
        console.log(decodedToken)
        if (!decodedToken)
            return res.status(400).send({ status: false, msg: 'token is not valid' })


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
    next()
}

const authorisation = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "projectthreebook");
        let userLoggingIn = req.params.bookId
        let userLoggedIn = decodedToken.userId
        let value = await bookModel.findById(userLoggingIn)
        if (value.userId != userLoggedIn) return res.send({ status: false, msg: "You are not allowed to modify requested book data" })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
    next()

}

module.exports.authorisation = authorisation

module.exports.authentication = authentication
