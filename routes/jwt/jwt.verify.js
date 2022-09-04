const jwt = require('jsonwebtoken')
require('dotenv/config')

const verified = (req, res, next)=>{
    const token = req.cookies.token

    if(token){
        jwt.verify(token, process.env.TOKEN, (err, verified)=>{
            if(err)return res.status(401).send('token is not correct').clearCookie("token")
            req.user = verified
            next()
        })
    }else{
        return res.status(401).redirect('/')
    }
}


const verifiedAuth = (req, res, next)=>{
    verified(req, res, ()=>{
        if(req.user._id == req.params._id || req.user.isAdmin){
            next()
        }else{
            return res.status(401).send('user not authorised')
        }
    })
}


const verifiedAdmin = (req, res, next)=>{
    verified(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            return res.status(401).send('Admin use only')
        }
    })
}


module.exports = {verifiedAdmin, verifiedAuth}