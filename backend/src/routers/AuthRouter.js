const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.post("/send-login-otp", AuthController.sendloginOTP);

module.exports = router;