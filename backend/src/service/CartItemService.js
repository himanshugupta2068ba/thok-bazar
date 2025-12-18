const CartItem=require("../models/CartItems")

class CartItemService{
    async removeCartItem(userId, cartItemId){
      const cartItem=await this.findCartItemById(cartItemId);

      if(cartItem.userId.toString()==userId.toString){
        await CartItem.deleteOne({_id:cartItem._id})
      }else{
        throw new Error("Unauthorized acesses")
      }
    }

    async findCartItemById(cartItemId){
        const cartItem=await CartItem.findById(cartItemId).populate("product");
        if(!cartItem){
            throw new Error("Cart item not found");
        }
        return cartItem;
    }

    async updateCartItem(userId, cartItemId,cartItemData){
      const cartItem=await this.findCartItemById(cartItemId);
      console.log(cartItemData || "No data");
      if(cartItem.userId.toString()==userId.toString()){
        const update={
            quantity:cartItemData.quantity,
            // mrpPrice:cartItemData.quantity*cartItemData.product.mrpPrice,
            // sellingPrice:cartItemData.quantity*cartItemData.product.sellingPrice
        }
        return await CartItem.findByIdAndUpdate(cartItemId,update,{new:true}).populate("product");
      }else{
        throw new Error("Unauthorized acesses")
      }
    }

}

module.exports=new CartItemService();