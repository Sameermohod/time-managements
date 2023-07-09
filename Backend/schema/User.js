const mongoose = require("mongoose")

const {Schema}=mongoose

const userSchema = new mongoose.Schema({
    username: String,
    loginTime: Date,
    logoutTime: Date,
    Date:{type:Date ,default: Date.now,},
    designation:String,
    hours:String,

  });

exports.Users = mongoose.model('Users',userSchema)