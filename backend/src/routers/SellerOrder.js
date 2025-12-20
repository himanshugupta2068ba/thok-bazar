const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const sellerAuthMiddleware = require('../middlewares/sellerAuthMiddleware');

router.get('/seller/orders',sellerAuthMiddleware,orderController.getSellerOrders);

router.put('/seller/order/:orderId/status',sellerAuthMiddleware,orderController.updateOrderStatus);



module.exports = router;