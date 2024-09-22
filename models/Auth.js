const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    fname: {type: String, required:true },
    lname: {type: String, required:true },
    dob: {type: String, required:true },
    gender: {type: String, required:true },
    mobile: {type: String, required:true },
    email: {type: String ,required:true},
    password: {type: String, required:true },
    otp: {type: String},
    avatar: {type: String, default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4rHk-t6N9r-UDu9KB5irEON9DwIWDX3Roig&s" },
})

module.exports = mongoose.model("auth", authSchema)