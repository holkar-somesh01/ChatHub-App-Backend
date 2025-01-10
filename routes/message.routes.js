
const router = require("express").Router()
const MessageController = require("../controller/message.controller")


router
    .get("/fetch-message", MessageController.FetchMessage)
    .post("/message-send/:receiverId", MessageController.sendMessage)
    .put("/message-update/:messageId", MessageController.UpdateMessage)
    .delete("/message-delete/:DeleteMessageId", MessageController.DeleteMessage)

module.exports = router