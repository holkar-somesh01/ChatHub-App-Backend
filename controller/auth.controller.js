const asyncHander = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { checkEmpty } = require("../utils/checkEmpty")
const Auth = require("../models/Auth")
const validator= require("validator")
const jwt = require("jsonwebtoken")
const SendMail = require("../utils/email")

exports.registerUser = asyncHander(async (req, res) => {
    const { name, password, mobile, email } = req.body
    const {error,isError } = checkEmpty({ name, password, mobile, email } )
    if (isError) {
         return res.status(400).json({message:"All Fields Required", error })
    }
     if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
     if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" })
    }
    if (!validator.isMobilePhone(mobile,"en-IN")) {
        return res.status(400).json({message:"Invalid Mobile Number"})
    }
    const isFound = await Auth.findOne({ email, mobile })
    if (isFound) {
        return res.status(400).json({ message: "Email Already registered with us" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await Auth.create({name, password:hashPass, mobile,email})
    res.json({message:"USER REGISTER SUCCESS"})
})
exports.loginUser = asyncHander(async (req, res) => {
    const { username, password } = req.body;
    const { error, isError } = checkEmpty({ username, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }
    try {
        const isFound = await Auth.findOne({$or: [{ email: username }, { mobile: username },]});
        if (!isFound) {
            return res.status(400).json({ message: "User Email OR Mobile Not Found" });
        }
        const isVerify = await bcrypt.compare(password, isFound.password);
        if (!isVerify) {
            return res.status(400).json({ message: "Password Do Not Match" });
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
            message: "Credentials Verify Success. OTP sent to your registered Email", 
            result: {
                _id: isFound._id,
                name: isFound.name,
                email: isFound.email,
                mobile: isFound.mobile,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
exports.verifyOTP = asyncHander(async (req, res) => {
    const { otp, username } = req.body
    const { isError, error } = checkEmpty({ otp, username })
    if (isError) {
        return res.status(400).json({message:"All Fields Required.", error})
    }
    const isFound = await Auth.findOne({$or: [{ email: username },{ mobile: username },]});
    if (!isFound) {
        return res.status(400).json({message:"Invalid Email OR Mobile"})
    }
    if (otp !== isFound.otp ) {
        return res.status(400).json({message:"Invalid OTP"})
    }
    const token = jwt.sign({ userId: isFound._id }, process.env.JWT_KEY, { expiresIn: "15d" })
    res.cookie("chathub", token, {
        maxAge: 1000 * 60 * 60 * 24 * 15,
        httpOnly:true
    })
    res.json({message:"OTP Verify Success"})
})
exports.logoutUser = asyncHander(async (req, res) => {
    res.clearCookie("chathub")
    res.json({message:"User Logout Success"})
})