const { Todo } = require('../models/Todo')
const { User } = require('../models/User')
const crypto = require('crypto')
const { verifiedAuth, verifiedAdmin } = require('./jwt/jwt.verify')
const router = require('express').Router()



router.post('/add/todo/:_id',verifiedAuth ,async(req, res)=>{
    const {_id}= req.params
    const newTodo =({
        todo: req.body.todo
    })
    
    try {
        const saveUser= await User.findOneAndUpdate({_id: _id},{
           $push:{todo: newTodo}
        })

        res.send('List added go back')
        console.log(newTodo)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/list/:_id',verifiedAuth ,async(req,res)=>{
    const user = await User.findOne({_id:req.params._id})
    res.render('todo', {todo: user.todo, user:user})
})

router.get('/admin', (req, res)=>{
    res.render("admin")
})

router.get('/users/:_id', verifiedAdmin, async(req, res)=>{
    const user = await User.findOne({_id: req.params._id})
    if(!user)return res.status(404).send('user has either been deleted or doesnot exist')
    res.render("edituser", {user: user})
})

router.get('/users/delete/:_id', verifiedAdmin, async(req, res)=>{
    try {
        const deleted =await User.findOneAndDelete({_id: req.params._id})
        if(deleted){
            res.send('user has been deleted')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/users/block/:_id', verifiedAdmin, async(req, res)=>{
    const user = await User.findOne({_id: req.params._id})
    if(user && !user.blocked){
        user.blocked = true
        await user.save()
        res.send(`${user.email} is blocked`)
    }else{
        res.status(400).send(`${user.email} already blocked`)
    }
})

router.get('/users/unblock/:_id', verifiedAdmin, async(req, res)=>{
    const user = await User.findOne({_id: req.params._id})
    if(user && user.blocked){
        user.blocked = false
        await user.save()
        res.send(`${user.email} is unblocked`)
    }else{
        res.status(400).send(`${user.email} already unblocked`)
    }
})


module.exports = router