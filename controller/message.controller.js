const AsyncHandler = require("express-async-handler")
const { UploadMultiple } = require("../utils/upload")
const Message = require("../models/Message")
const cloudinary = require("../utils/cloudinary.config")

exports.sendMessage = AsyncHandler(async (req, res) => {
    UploadMultiple(req, res, async (err) => {
        const { receiverId } = req.params
        let image
        console.log(req.file, "FILE")
        console.log(req.files, "Files")

        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const { secure_url } = await cloudinary.uploader.upload(req.file[i].path)
                image = secure_url

            }
        }
        const { message } = req.body
        // await Message.create({ message, receiverId, senderId: req.user, image })
        res.status(200).json({ message: "Message Send Success" })
    })
})