const expressAsyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const validator = require("validator")
const bcrypt = require("bcryptjs")
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
    const result = await ChatUser.find({ userId: req.user, isDelete: false, isRemove: false, isHide: false })
    return res.status(200).json({ status: 200, message: "Contact Fetched...!", result })
})
exports.UpdateUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({ status: 200, message: "Contact Updated...!" })
})
exports.hideUser = expressAsyncHandler(async (req, res) => {
    const { hideID } = req.params
    await ChatUser.findByIdAndUpdate(hideID, { isHide: true })
    return res.json({ status: 200, message: "User Hide Success" })
})
exports.LockChat = expressAsyncHandler(async (req, res) => {
    const { lockId } = req.params
    const { lock, password } = req.body
    const { isError, error } = checkEmpty({ password })
    if (isError) {
        return res.status(400).json({ message: "All fields required.", error })
    }
    const hash = await bcrypt.hash(password, 10)
    await ChatUser.findByIdAndUpdate(lockId, {
        isLocked: {
            lock: true,
            password: hash
        }
    })
    res.json({ status: 200, message: "Your chat is Locked" })
})
exports.deleteUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndUpdate(req.params.id, { isDelete: true })
    res.status(200).json({ status: 200, message: "Contact Deleted...!" })
})
exports.restoreUser = expressAsyncHandler(async (req, res) => {
    await ChatUser.findByIdAndUpdate(req.params.id, { isDelete: false })
    res.status(200).json({ status: 200, message: "Contact Restored...!" })
})
