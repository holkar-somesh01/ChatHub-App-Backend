const router = require("express").Router();
const { adminProtected } = require("../middleware/Protected");
const authController = require("./../controller/auth.controller");
router
    .post("/register-user", authController.registerUser)
    .post("/login-user", authController.loginUser)
    .post("/verify-otp", authController.verifyOTP)
    .post("/logout-user", authController.logoutUser)
    .put("/update-user-profile", adminProtected, authController.UpdateProfile)
// .post("/new-contact", authController.AddNewUser)

module.exports = router;
