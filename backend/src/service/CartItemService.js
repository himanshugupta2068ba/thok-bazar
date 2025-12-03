class CartItem{
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

      if(cartItem.userId.toString()==userId.toString){
        const update={
            quantity:cartItemData.quantity,
            mrpPrice:cartItemData.quantity*cartItemData.product.mrpPrice,
            p[]\
        }
      }else{
        throw new Error("Unauthorized acesses")
      }
    }

}