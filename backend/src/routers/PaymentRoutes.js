const express=require('express');
const router=express.Router();
const PaymentController=require('../controllers/PaymentController');
const authMiddleware=require('../middlewares/authMiddleware');

router.get('/:paymentLinkId/success',authMiddleware,PaymentController.paymentSucessHandler);

module.exports=router;