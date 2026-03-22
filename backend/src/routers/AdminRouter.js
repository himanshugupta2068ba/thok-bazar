const express = require('express');
const sellerController = require('../controllers/sellerController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const router = express.Router();

router.post("/login", adminController.login);
router.get("/session", adminAuthMiddleware, adminController.getSession);
router.get("/account", adminAuthMiddleware, adminController.getAccount);
router.put("/account", adminAuthMiddleware, adminController.updateAccount);

router.use(adminAuthMiddleware);

router.patch("/seller/:id/status/:status", sellerController.updateSellerAccountStatus);
router.get("/orders", orderController.getAllOrdersForAdmin);

module.exports = router;
