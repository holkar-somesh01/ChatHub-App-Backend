const expressAsyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const validator = require("validator")
const ChatUser = require("../models/ChatUser")

exports.AddNewUser = expressAsyncHandler(async (req, res) => {
    const { fname, lname, email, mobile } = req.body
    const { isError, error } = checkEmpty({ fname, lname, mobile })
    if (isError) {
        return res.status(400).json({ status: 400, message: "All Fields Required", error: error })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ status: 400, message: "Invalid Mobile Number" })
    }
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ status: 400, message: "Invalid Email Number" })
    }
    await ChatUser.create({ fname, lname, email, mobile, userId: req.user })
    return res.json({ status: 200, message: "New Contact Added" })
})
exports.fetchUser = expressAsyncHandler(async (req, res) => {
    const result = await ChatUser.find({ userId: req.user })
    return res.status(200).json({ status: 200, message: "Contact Fetched...!", result })
})
exports.UpdateUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({ status: 200, message: "Contact Updated...!" })
})
exports.deleteUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: 200, message: "Contact Deleted...!" })
})