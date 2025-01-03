const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { checkEmpty } = require("../utils/checkEmpty")
const Auth = require("../models/Auth")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const SendMail = require("../utils/email")
const ChatUser = require("../models/ChatUser")

exports.registerUser = asyncHandler(async (req, res) => {
    const { fname, lname, dob, gender, mobile, email, password } = req.body
    const { error, isError } = checkEmpty({ fname, lname, dob, gender, mobile, email, password })
    if (isError) {
        return res.status(400).json({ status: 400, message: "All Fields Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ status: 400, message: "Invalid Email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ status: 400, message: "Provide Strong Password" })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ status: 400, message: "Invalid Mobile Number" })
    }
    const isFound = await Auth.findOne({ email, mobile })
    if (isFound) {
        return res.status(400).json({ status: 400, message: "Email Already registered with us" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await Auth.create({ password: hashPass, fname, lname, dob, gender, mobile, email, })
    res.json({ status: 200, message: "USER REGISTER SUCCESS" })
})
exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const { error, isError } = checkEmpty({ username, password });
    if (isError) {
        return res.status(400).json({ status: 400, message: "All Fields Required", error });
    }
    try {
        const isFound = await Auth.findOne({ $or: [{ email: username }, { mobile: username },] });
        if (!isFound) {
            return res.status(400).json({ status: 400, message: "User Email OR Mobile Not Found" });
        }
        const isVerify = await bcrypt.compare(password, isFound.password);
        if (!isVerify) {
            return res.status(400).json({ status: 400, message: "Password Do Not Match" });
        }
        const otp = Math.floor(10000 + Math.random() * 900000);
        await SendMail({
            to: isFound.email,
            subject: `Login OTP`,
            message: `<h1>Do Not share Your Account OTP</h1>
                      <p>Your Login OTP <strong>${otp}</strong> </p>`
        });

        await Auth.findByIdAndUpdate(isFound._id, { otp: otp })
        res.json({
            status: 200,
            message: "Credentials Verify Success. OTP sent to your registered Email",
            result: {
                _id: isFound._id,
                fname: isFound.fname,
                lname: isFound.lname,
                gender: isFound.gender,
                dob: isFound.dob,
                email: isFound.email,
                mobile: isFound.mobile,
                avatar: isFound.avatar,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
})
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, username } = req.body
    const { isError, error } = checkEmpty({ otp, username })
    if (isError) {
        return res.status(400).json({ status: 400, message: "All Fields Required.", error })
    }
    const isFound = await Auth.findOne({ $or: [{ email: username }, { mobile: username },] });
    if (!isFound) {
        return res.status(400).json({ status: 400, message: "Invalid Email OR Mobile" })
    }
    if (otp !== isFound.otp) {
        return res.status(400).json({ status: 400, message: "Invalid OTP" })
    }
    const token = jwt.sign({ userId: isFound._id }, process.env.JWT_KEY, { expiresIn: "15d" })
    res.cookie("chathub", token, {
        maxAge: 1000 * 60 * 60 * 24 * 15,
        httpOnly: true
    })
    res.json({
        status: 200,
        message: "OTP Verify Success", result: {
            _id: isFound._id,
            fname: isFound.fname,
            lname: isFound.lname,
            gender: isFound.gender,
            dob: isFound.dob,
            email: isFound.email,
            mobile: isFound.mobile,
            avatar: isFound.avatar,
        }
    })
})
exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("chathub")
    res.json({ status: 200, message: "User Logout Success" })
})
exports.UpdateProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ status: 200, message: "Profile Update Success" })
})