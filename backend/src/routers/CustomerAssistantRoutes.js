const express = require("express");
const customerAssistantController = require("../controllers/customerAssistantController");

const router = express.Router();

router.post("/customer-assistant", customerAssistantController.reply);

module.exports = router;
