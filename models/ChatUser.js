const mongoose = require("mongoose")

const chatUserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: "auth", required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isHide: { type: Boolean, default: false },
    isLocked: {
        lock: { type: Boolean, default: false },
        password: { type: String },
    },
    isRemove: { type: Boolean, default: false },
}, { timestamps: true })
module.exports = mongoose.model("chatuser", chatUserSchema)