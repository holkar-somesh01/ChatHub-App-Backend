const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    image: { type: [String] },
    senderId: { type: mongoose.Types.ObjectId, ref: "auth" },
    receiverId: { type: mongoose.Types.ObjectId, ref: "chatuser" },
    updateTime: { type: Date, default: Date.now() },
    isDelete: { type: Boolean, default: false },
    isRemove: { type: Boolean, default: false },
    isStared: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema)