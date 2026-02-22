const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/',authMiddleware,orderController.createOrder);

router.get('/user/history',authMiddleware,orderController.userOrdersHistory);

router.get('/item/:orderItemId',authMiddleware,orderController.getOrderItemById);

router.get('/:orderId',authMiddleware,orderController.getOrderById);


router.put('/:orderId/cancel',authMiddleware,orderController.cancelOrder);


module.exports = router;