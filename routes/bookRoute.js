let express = require('express')
let book= require("../controller/bookController")

const {userAuthetication} = require("../middlewares/authToken")
const {upload}= require('../middlewares/bookImageUpload')

let router = express.Router()

router.post('/create',userAuthetication,upload.single("bookImage"),book.createBook)
router.patch('/update/:id',userAuthetication,book.updateBook)
router.get('/all',userAuthetication,book.getBooks)
router.get('/:id',userAuthetication,book.getBookById)
router.delete('/delete/:id',userAuthetication,book.deleteBook)

module.exports =router
