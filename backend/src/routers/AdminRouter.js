const express = require('express');
const sellerController = require('../controllers/sellerController');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.patch("/seller/:id/status/:status", sellerController.updateSellerAccountStatus);
router.get("/orders", orderController.getAllOrdersForAdmin);

module.exports = router;