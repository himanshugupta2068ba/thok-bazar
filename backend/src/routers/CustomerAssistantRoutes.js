const express = require("express");
const customerAssistantController = require("../controllers/customerAssistantController");
const rateLimit = require('../middlewares/rateLimit');

const router = express.Router();

router.post("/customer-assistant", rateLimit({ windowMs: 60_000, max: 12 }), customerAssistantController.reply);

module.exports = router;
