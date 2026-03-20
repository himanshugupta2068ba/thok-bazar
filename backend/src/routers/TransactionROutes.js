
const express=require('express');
const router=express.Router();
const sellerMiddleware=require('../middlewares/sellerAuthMiddleware');
const TransactionController=require('../controllers/TransactionController');

router.get('/seller',sellerMiddleware,TransactionController.getTransactionsBySeller);
router.patch('/seller/:transactionId/refund',sellerMiddleware,TransactionController.refundTransactionBySeller);

module.exports=router;
