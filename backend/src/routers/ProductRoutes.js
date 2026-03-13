const express=require('express');
const ProductService=require('../service/ProductService');
const router=express.Router();
const ProductController=require('../controllers/ProductController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search',ProductController.searchProducts);

router.get('/',ProductController.getAllProducts);

router.get('/:productId/reviews', ProductController.getProductReviews);

router.post('/:productId/reviews', authMiddleware, ProductController.createProductReview);

router.get('/:productId/similar', ProductController.getSimilarProducts);

router.get('/:productId',ProductController.getProductById);

module.exports=router;
