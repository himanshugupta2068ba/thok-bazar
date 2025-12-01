const Cart=require("../models/Cart")

class CartService{
   
    async findUserCart(user){
        let cart=await Cart.findOne({user:user._id});

        let totalPrice=0;
        let totalDiscountedPrice=0;
        let totalItem=cart.cartItems.length;

        cart.cartItems.forEach((cartItem)=>{
            totalPrice+=cartItem.mrpPrice;
            totalDiscountedPrice+=cartItem.sellingPrice;
        })

        cart.totalMrpPrice=totalPrice;
        cart.totalSellingPrice=totalDiscountedPrice;
        cart.totalItems=totalItem;
        cart.discount=calculateDiscountPercentage(
            totalPrice,
            totalDiscountedPrice
        );

    }
}