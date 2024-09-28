const jwt = require("jsonwebtoken")

exports.adminProtected = ( req, res, next) => {
    // Cookie
    const { chathub } = req.cookies 
    if (!chathub) {
        return res.status(401).json({message:"No Cookie Found"})
    }
    // Token Verify
    jwt.verify(chathub, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({message:"Invalid Token"})
        }
        // console.log("******",decode.userId,"***********");
        req.user = decode.userId  
    })
    next()
}
