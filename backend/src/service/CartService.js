const Cart=require("../models/Cart")
const CartItem=require("../models/CartItems")
const calculateDiscountPercentage=require("../util/discountCalculator")

const cartItemPopulateConfig = {
    path: "product",
    populate: {
        path: "sellerId",
        select: "sellerName businessDetails",
    },
};

class CartService{
   
    async findUserCart(user){
        const cart=await Cart.findOne({user:user._id});

        if(!cart){
            throw new Error("Cart not found");
        }

        const cartItems=await CartItem.find({cart:cart._id}).populate(cartItemPopulateConfig);

        const totalPrice=cartItems.reduce((total, cartItem) => total + Number(cartItem.mrpPrice || 0), 0);
        const totalDiscountedPrice=cartItems.reduce((total, cartItem) => total + Number(cartItem.sellingPrice || 0), 0);
        const totalItem=cartItems.reduce((total, cartItem) => total + Number(cartItem.quantity || 0), 0);

        cart.cartItems=cartItems.map((cartItem)=>cartItem._id);
        cart.totalMrpPrice=totalPrice;
        cart.totalSellingPrice=totalDiscountedPrice;
        cart.totalItems=totalItem;
        cart.discount=calculateDiscountPercentage(
            totalPrice,
            totalDiscountedPrice
        );

        await cart.save();

        return {
            _id: cart._id,
            user: cart.user,
            cartItems,
            totalMrpPrice: cart.totalMrpPrice,
            totalSellingPrice: cart.totalSellingPrice,
            totalItems: cart.totalItems,
            discount: cart.discount,
            couponCode: cart.couponCode,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }

    async addCartItem(user,product,size,quantity){
        const cart=await Cart.findOne({user:user._id});

        if(!cart){
            throw new Error("Cart not found");
        }

        const normalizedQuantity=Number(quantity || 1);
        const normalizedSize=size || product.size || "";

        if(normalizedQuantity>product.stock){
            throw new Error("Insufficient stock available");
        }

        let isPresent=await CartItem.findOne({
            cart:cart._id,
            product:product._id,
            size:normalizedSize
        }).populate(cartItemPopulateConfig);

        if(!isPresent){
            const cartItem=new CartItem({
                cart:cart._id,
                product:product._id,
                size:normalizedSize,
                quantity:normalizedQuantity,
                mrpPrice:product.mrpPrice*normalizedQuantity,
                sellingPrice:product.sellingPrice*normalizedQuantity,
                userId:user._id.toString()
            });
            await cartItem.save();

            if(!cart.cartItems.some((cartItemId)=>cartItemId.toString()===cartItem._id.toString())){
                cart.cartItems.push(cartItem._id);
                await cart.save();
            }

            return await CartItem.findById(cartItem._id).populate(cartItemPopulateConfig);
        }
        if(isPresent.quantity+normalizedQuantity>product.stock){
            throw new Error("Insufficient stock available");
        }
        isPresent.quantity+=normalizedQuantity;
        isPresent.mrpPrice=product.mrpPrice*isPresent.quantity;
        isPresent.sellingPrice=product.sellingPrice*isPresent.quantity;
        await isPresent.save();
        return await CartItem.findById(isPresent._id).populate(cartItemPopulateConfig);
    }
}

module.exports=new CartService();
