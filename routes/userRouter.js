let express = require('express')
let user= require("../controller/userController")

const {userAuthetication} = require("../middlewares/authToken")
const {upload}= require('../middlewares/userImageStorage')

let router = express.Router()

router.post('/create',upload.single("profilePic"),user.createUser)
router.post('/verify-otp',user.verifyOTP)
router.post('/login',user.userLogin)

module.exports =router