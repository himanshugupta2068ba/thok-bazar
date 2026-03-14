const Cart=require("../models/Cart")
const CartItem=require("../models/CartItems")

const cartItemPopulateConfig = {
    path: "product",
    populate: {
        path: "sellerId",
        select: "sellerName businessDetails",
    },
};

class CartItemService{
    async removeCartItem(userId, cartItemId){
      const cartItem=await this.findCartItemById(cartItemId);

      if(cartItem.userId.toString()===userId.toString()){
        await CartItem.deleteOne({_id:cartItem._id})
        await Cart.findByIdAndUpdate(cartItem.cart, {
          $pull: { cartItems: cartItem._id },
        });
      }else{
        throw new Error("Unauthorized acesses")
      }
    }

    async findCartItemById(cartItemId){
        const cartItem=await CartItem.findById(cartItemId).populate(cartItemPopulateConfig);
        if(!cartItem){
            throw new Error("Cart item not found");
        }
        return cartItem;
    }

    async updateCartItem(userId, cartItemId,cartItemData){
      const cartItem=await this.findCartItemById(cartItemId);
      if(cartItem.userId.toString()===userId.toString()){
        const quantity=Number(cartItemData.quantity || 1);

        if(quantity>Number(cartItem.product?.stock || 0)){
          throw new Error("Insufficient stock available");
        }

        const update={
            quantity,
            mrpPrice:Number(cartItem.product?.mrpPrice || 0)*quantity,
            sellingPrice:Number(cartItem.product?.sellingPrice || 0)*quantity
        }
        return await CartItem.findByIdAndUpdate(cartItemId,update,{new:true}).populate(cartItemPopulateConfig);
      }else{
        throw new Error("Unauthorized acesses")
      }
    }

}

module.exports=new CartItemService();
