const express=require('express');
const router=express.Router();
const SellerProductController=require('../controllers/ProductController');
const authenticateSeller=require('../middlewares/authMiddleware');

router.get('/',authenticateSeller,SellerProductController.getProductBySellerId);

router.post('/',authenticateSeller,SellerProductController.createProduct);

router.delete('/:productId',authenticateSeller,SellerProductController.deleteProduct);

router.put('/:productId',authenticateSeller,SellerProductController.updateProduct);

module.exports=router;