const express=require("express");
const CartController=require("../controllers/CartController");
const authMiddleware=require("../middlewares/authMiddleware");
const router=express.Router();

router.get("/",authMiddleware,CartController.findUserCartHandler);

router.post("/add-item",authMiddleware,CartController.addItemToCart);

router.delete("/item/:cartItemId",authMiddleware,CartController.deleteCartItemHandler);

router.put("/item/:cartItemId",authMiddleware,CartController.updateCartItemHandler);
module.exports=router;