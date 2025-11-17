const express=require('express');
const ProductService=require('../service/ProductService');
const router=express.Router();
const ProductController=require('../controllers/ProductController');

router.get('/search',ProductController.searchProducts);

router.get('/',ProductController.getAllProducts);

router.get('/:productId',ProductController.getProductById);

module.exports=router;