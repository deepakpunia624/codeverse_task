let express = require("express")
const userRouter= require('./userRouter')
const bookRouter = require('./bookRoute')


let commonRouter = express.Router()

commonRouter.use('/user', userRouter)
commonRouter.use('/book', bookRouter)


module.exports = commonRouter