const mongoose = require("mongoose")

const chatUserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: "auth", required: true },
})
module.exports = mongoose.model("chatuser", chatUserSchema)