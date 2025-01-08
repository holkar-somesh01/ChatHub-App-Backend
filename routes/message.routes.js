
const router = require("express").Router()
const MessageController = require("../controller/message.controller")


router
    .post("/message-send/:receiverId", MessageController.sendMessage)


module.exports = router