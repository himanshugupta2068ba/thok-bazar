const Cart=require("../models/Cart")
const {calculateDiscountPercentage}=require("../util/discountCalculator")

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
        
        let cartItems=await CartItem.find({cart:cart._id}).populate("product");
        cart.cartItems=cartItems;
        return cart;
    }

    async addCartItem(user,product,size,quantity){
        const cart=await this.findUserCart(user);

        let isPresent=await CartItem.findOne({
            cart:cart._id,
            product:product._id,
            size:size
        }).populate("product");

        if(!isPresent){
            const cartItem=new CartItem({
                cart:cart._id,
                product:product._id,
                size:size,
                quantity:quantity,
                mrpPrice:product.mrpPrice*quantity,
                sellingPrice:product.sellingPrice*quantity,
                userId:user._id
            });
            await cartItem.save();
            return cartItem;
        }
        isPresent.quantity+=quantity;
        isPresent.mrpPrice+=product.mrpPrice*quantity;
        isPresent.sellingPrice+=product.sellingPrice*quantity;
        await isPresent.save();
        return isPresent;
    }
}