const CartService=require("../service/CartService")
const UserService=require("../service/UserService")
const ProductService=require("../service/ProductService")
const CartItemService=require("../service/CartItemService")

class CartController{

    async findUserCartHandler(req,res){
        try{
            const user=await req.user;

            const cart=await CartService.findUserCart(user);
            res.status(200).json(cart);
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }

    async addItemToCart(req,res){
        try{
            const user=await req.user;
            const product=await ProductService.findProductById(req.body.productId);
            
            const cartItem=await CartService.addCartItem(
                user,
                product,
                req.body.size,
                req.body.quantity
            );
            res.status(200).json(cartItem);
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }

    async deleteCartItemHandler(req,res){
        try{
            const cartItemId=req.params.cartItemId;
            await CartItemService.deleteCartItemById(cartItemId);
            res.status(200).json({message:"Cart item deleted successfully"});
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }
    

}