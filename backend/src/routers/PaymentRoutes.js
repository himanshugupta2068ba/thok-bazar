const express=require('express');
const router=express.Router();
const PaymentController=require('../controllers/paymentController');
const authMiddleware=require('../middlewares/authMiddleware');

router.get('/success',authMiddleware,PaymentController.paymentSucessHandler);
router.get('/:paymentLinkId/success',authMiddleware,PaymentController.paymentSucessHandler);

module.exports=router;