const { User } = require('../models/User')
const bcrypt = require('bcrypt')
const {Todo} = require('../models/Todo')
const crypto = require('crypto')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv/config')
const {verifiedAuth, verifiedAdmin} = require('./jwt/jwt.verify')
router.get('/login', async(req, res)=>{
    res.render("login")
})

router.post('/register', async(req, res)=>{

    const user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send('user already exist')

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
        userId:crypto.randomBytes(10).toString('hex'),
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashed
    })

    const alltodo = await Todo.find()
    try {
        const savedUser = await newUser.save()
        res.redirect('/login')
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/login', async(req, res)=>{
    res.render('login')
})
router.post('/login', async(req,res)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(404).send('user does not exist')

    if(user.blocked) return res.status(401).send('you are blocked message admin for more details')

    const valid = await bcrypt.compare(req.body.password, user.password)
    if(!valid) return res.status(401).send('password not correct')

    const token = jwt.sign({_id: user._id, isAdmin:user.isAdmin}, process.env.TOKEN, {expiresIn:'5h'})

    res.cookie('token', token, {
        // secure: true,
        // signed: true,
        // maxAge: 1800000
    })
    res.status(301).render("addtodo", {user:user})
})

router.post('/login/admin', async(req,res)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(404).send('user does not exist')

    const alluser = await User.find({})

    if(!user.isAdmin) return res.status(401).send('you are not an admin')
    const valid = await bcrypt.compare(req.body.password, user.password)
    if(!valid) return res.status(401).send('password not correct')

    const token = jwt.sign({_id: user._id, isAdmin:user.isAdmin}, process.env.TOKEN, {expiresIn:'5h'})

    res.cookie('token', token, {
        // secure: true,
        // signed: true,
        // maxAge: 1800000
    })
    res.status(301).render("adminpage", {user:alluser})
})


router.get('/delete/:id',async(req, res)=>{

    const user = await User.findOne({_id: req.params.id})
    if(!user)return res.status(404).send('user has either been deleted or doesnot exist')
    const todo = await User.findOne({_id: req.params.id})
    res.render('delete', {todo: todo.todo, user:user})
})

router.get('/delete/:_id/:todoId',verifiedAuth ,async(req, res)=>{
    const user = await User.findOne({_id: req.params._id})
    if(!user)return res.status(404).send('user has either been deleted or doesnot exist')

    if(!req.params.todoId) return res.status(400).send('item has either been deleted or does not exist')

    try {
        const update = await User.findOneAndUpdate({_id: req.params._id}, {
            $pull:{todo:{_id: req.params.todoId}}
        })
        res.render("addtodo", {user:update})
    } catch (error) {
        console.log(error.message)
    }
})
module.exports = router