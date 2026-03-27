const express=require('express');
const router=express.Router();
const sellerMiddleware=require('../middlewares/sellerAuthMiddleware');
const sellerReportController=require('../controllers/sellerReportController');

router.get('/',sellerMiddleware,sellerReportController.getSellerReport);

module.exports=router;