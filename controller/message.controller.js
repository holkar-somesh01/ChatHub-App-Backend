const AsyncHandler = require("express-async-handler")
const { UploadMultiple } = require("../utils/upload")
const Message = require("../models/Message")
const cloudinary = require("../utils/cloudinary.config")

exports.sendMessage = AsyncHandler(async (req, res) => {
    UploadMultiple(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error Occupied Uploading images", error: err.message })
        }
        const { receiverId } = req.params
        let image = []
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const { secure_url } = await cloudinary.uploader.upload(req.file[i].path)
                image.push(secure_url)
            }
        }
        const { message } = req.body
        await Message.create({ message, receiverId, senderId: req.user, image })
        res.status(200).json({ message: "Message Send Success" })
    })
})
exports.UpdateMessage = AsyncHandler(async (req, res) => {
    UploadMultiple(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error Occupied Uploading images", error: err.message })
        }
        const { messageId } = req.params
        let image = []
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const { secure_url } = await cloudinary.uploader.upload(req.file[i].path)
                image.push(secure_url)
            }
        }
        const { message } = req.body
        await Message.findByIdAndUpdate(messageId, { message, image })
        res.status(200).json({ message: "Message Update Success" })
    })
})
exports.DeleteMessage = AsyncHandler(async (req, res) => {
    const { DeleteMessageId } = req.params
    await Message.findByIdAndUpdate(DeleteMessageId, { isDelete: true })
    return res.status(200).json({ status: 200, message: "Message Delete Success" })
})
exports.FetchMessage = AsyncHandler(async (req, res) => {
    await Message.find({ isDelete: false })
    return res.status(200).json({ status: 200, message: "Message Fetch Success" })
})
exports.RestoreMessage = AsyncHandler(async (req, res) => {
    const { messageId } = req.params
    await Message.findByIdAndUpdate(messageId, { isDelete: false })
    return res.status(200).json({ status: 200, message: "Message Restore Success!" })
})