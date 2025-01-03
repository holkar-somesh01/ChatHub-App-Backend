const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    senderId: { type: mongoose.Types.ObjectId, ref: "auth" },
    receiverId: { type: mongoose.Types.ObjectId, ref: "chatuser" }
})

module.exports = mongoose.model("Message", messageSchema)