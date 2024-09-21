const nodemailer = require("nodemailer")

const SendMail = ({subject, to,message}) => new Promise((resolve, reject) => {
    const Email = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:process.env.FROM_EMAIL,
            pass:process.env.EMAIL_PASS,
        }
    })
    Email.sendMail({
        from: process.env.FROM_EMAIL,
        to: to,
        message: message,
        subject: subject,
        html:message
    }, (err) => {
        if (err) {
            console.log(err)
            reject(false)
        } else {
            resolve(true)
        }
    })
})

module.exports = SendMail