// const AsyncHandler = require("express-async-handler")
// const { UploadMultiple } = require("../utils/upload")
// const Message = require("../models/Message")
// const cloudinary = require("../utils/cloudinary.config")

// exports.sendMessage = AsyncHandler(async (req, res) => {
//     UploadMultiple(req, res, async (err) => {
//         if (err) {
//             return res.status(500).json({ message: "Error Occupied Uploading images", error: err.message })
//         }
//         const { receiverId } = req.params
//         let image = []
//         if (req.files) {
//             for (let i = 0; i < req.files.length; i++) {
//                 const { secure_url } = await cloudinary.uploader.upload(req.file[i].path)
//                 image.push(secure_url)
//             }
//         }
//         const { message } = req.body
//         await Message.create({ message, receiverId, senderId: req.user, image })
//         res.status(200).json({ message: "Message Send Success" })
//     })
// })
// exports.UpdateMessage = AsyncHandler(async (req, res) => {
//     UploadMultiple(req, res, async (err) => {
//         if (err) {
//             return res.status(500).json({ message: "Error Occupied Uploading images", error: err.message })
//         }
//         const { messageId } = req.params
//         let image = []
//         if (req.files) {
//             for (let i = 0; i < req.files.length; i++) {
//                 const { secure_url } = await cloudinary.uploader.upload(req.file[i].path)
//                 image.push(secure_url)
//             }
//         }
//         const { message } = req.body
//         await Message.findByIdAndUpdate(messageId, { message, image })
//         res.status(200).json({ message: "Message Update Success" })
//     })
// })
// exports.DeleteMessage = AsyncHandler(async (req, res) => {
//     const { DeleteMessageId } = req.params
//     await Message.findByIdAndUpdate(DeleteMessageId, { isDelete: true })
//     return res.status(200).json({ status: 200, message: "Message Delete Success" })
// })
// exports.FetchMessage = AsyncHandler(async (req, res) => {
//     await Message.find({ isDelete: false })
//     return res.status(200).json({ status: 200, message: "Message Fetch Success" })
// })
// exports.RestoreMessage = AsyncHandler(async (req, res) => {
//     const { messageId } = req.params
//     await Message.findByIdAndUpdate(messageId, { isDelete: false })
//     return res.status(200).json({ status: 200, message: "Message Restore Success!" })
// })

















const Message = require("../models/messageModel");

// Create a new message
exports.createMessage = async (req, res) => {
    try {
        const { message, image, senderId, receiverId } = req.body;
        const newMessage = await Message.create({ message, image, senderId, receiverId });
        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all messages (with optional filters like senderId, receiverId)
exports.getAllMessages = async (req, res) => {
    try {
        const filters = req.query || {};
        const messages = await Message.find(filters).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a single message by ID
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ success: false, message: "Message not found" });
        res.status(200).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a message
exports.updateMessage = async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Message not found" });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Soft delete (toggle isDelete)
exports.softDeleteMessage = async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(req.params.id, { isDelete: true }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Message not found" });
        res.status(200).json({ success: true, message: "Message marked as deleted", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mark or unmark as starred
exports.toggleStarMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ success: false, message: "Message not found" });

        message.isStared = !message.isStared;
        await message.save();

        res.status(200).json({ success: true, message: "Star status toggled", data: message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mark as removed (toggle isRemove)
exports.markAsRemoved = async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(req.params.id, { isRemove: true }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Message not found" });
        res.status(200).json({ success: true, message: "Message marked as removed", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Permanently delete a message
exports.deleteMessagePermanently = async (req, res) => {
    try {
        const deleted = await Message.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Message not found" });
        res.status(200).json({ success: true, message: "Message permanently deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
