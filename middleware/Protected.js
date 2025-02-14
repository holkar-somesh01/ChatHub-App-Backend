const jwt = require("jsonwebtoken")

exports.adminProtected = (req, res, next) => {
    const { chathub } = req.cookies
    if (!chathub) {
        return res.status(401).json({ status: 401, message: "No Cookie Found" })
    }
    jwt.verify(chathub, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ status: 401, message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}
