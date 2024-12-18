require("dotenv").config();
require("./config/modelConfig");
require("./model/userSchema");
require("./model/bookSchema")
const { createDefaultAdmin } = require('./controller/adminController');
const commonRouter = require("./routes/mainRoute");

const express = require('express')

const app = express();

app.use(express.json())

createDefaultAdmin();

app.use(express.json());

app.use("/", commonRouter);

app.listen(process.env.PORT, (req, res) => {
    console.log(`server is running on PORT no : ${process.env.PORT}`)
})