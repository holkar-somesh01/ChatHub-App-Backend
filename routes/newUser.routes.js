const router = require("express").Router()
const newContactController = require("./../controller/newcontact.controller")
router
    .get("/fetch-contact", newContactController.fetchUser)
    .post("/new-contact", newContactController.AddNewUser)
    .put("/update-contact/:id", newContactController.UpdateUser)
    .put("/hide-chat/:hideID", newContactController.hideUser)
    .put("/lock-chat/:lockId", newContactController.LockChat)
    .delete("/delete-contact/:id", newContactController.deleteUser)

module.exports = router