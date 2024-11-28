const expressAsyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const validator = require("validator")
const ChatUser = require("../models/ChatUser")

exports.AddNewUser = expressAsyncHandler(async (req, res) => {
    const { fname, lname, email, mobile } = req.body
    const { isError, error } = checkEmpty({ fname, lname, mobile })
    if (isError) {
        return res.status(400).json({ message: "All Feilds Required", error: error })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" })
    }
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email Number" })
    }
    await ChatUser.create({ fname, lname, email, mobile, userId: req.user })
    res.json({ message: "New Contact Added" })
})
exports.fetchUser = expressAsyncHandler(async (req, res) => {
    const result = await ChatUser.find({ userId: req.user })
    res.json({ message: "Contact Fetched...!", result })
})
exports.UpdateUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: "Contact Updated...!" })
})
exports.deleteUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndDelete(req.params.id)
    res.json({ message: "Contact Deleted...!" })
})