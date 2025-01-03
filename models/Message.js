const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    image: { type: [String] },
    senderId: { type: mongoose.Types.ObjectId, ref: "auth" },
    receiverId: { type: mongoose.Types.ObjectId, ref: "chatuser" },
    isDelete: { type: Boolean, default: false }
})

module.exports = mongoose.model("Message", messageSchema)