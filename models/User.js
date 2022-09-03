const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    userId:{type:String},
    fullname:{type: String, required: true},
    email: {type: String, required: true},
    password:{type: String, required: true},
    blocked: {type: Boolean, default:false},
    isAdmin:{type:Boolean, default: false},
    todo:[({
        _id:{type: String,
            default: function () {
                return new ObjectId().toString()
            }},
        todo: {type: String},
        date:{type:String}
    })]
},{timestamps: true})

const User = mongoose.model('User', userSchema, )

module.exports = {User}