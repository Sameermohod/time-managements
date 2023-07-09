const mongoose = require("mongoose")

const {Schema}=mongoose

const authSchema = new mongoose.Schema({
    username: String,
    email:String,
    password:String,
    role:{type:String ,default:"Admin"}
});

exports.Auth = mongoose.model('Auth',authSchema)