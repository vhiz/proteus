const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')
const helmet = require('helmet')
const todoRoute = require('./routes/todo')
const userRoute = require('./routes/user')
const cookieParser = require('cookie-parser')

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=>{
    console.log('mongoose')
})

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.use(cookieParser())
app.use('/', todoRoute)
app.use('/', userRoute)

app.get('/', (req, res)=>{
    res.render("index")
})




const Port = process.env.PORT|| 3999
app.listen(Port, ()=>{
    console.log(`open at ${Port}`)
})