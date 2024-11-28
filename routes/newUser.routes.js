const router = require("express").Router()
const newContactController = require("./../controller/newcontact.controller")
router
    .get("/fetch-contact", newContactController.fetchUser)
    .post("/new-contact", newContactController.AddNewUser)
    .put("/update-contact/:id", newContactController.UpdateUser)
    .delete("/delete-contact/:id", newContactController.deleteUser)

module.exports = router