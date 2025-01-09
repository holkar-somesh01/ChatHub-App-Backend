
const router = require("express").Router()
const MessageController = require("../controller/message.controller")


router
    .post("/message-send/:receiverId", MessageController.sendMessage)
    .put("/message-update/:messageId", MessageController.UpdateMessage)


module.exports = router