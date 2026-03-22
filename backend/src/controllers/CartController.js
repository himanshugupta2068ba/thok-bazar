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
            const product=await ProductService.findProductbyId(req.body.productId);
            if(!product){
                return res.status(404).json({error:"Product not found"});
            }
            
            const cartItem=await CartService.addCartItem(
                user,
                product,
                req.body.size,
                req.body.quantity
            );
            const cart=await CartService.findUserCart(user);
            res.status(200).json(cart);
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }

    async deleteCartItemHandler(req,res){
        try{
            const user=await req.user;
            const cartItemId=req.params.cartItemId;
            await CartItemService.removeCartItem(user._id,cartItemId);
            const cart=await CartService.findUserCart(user);
            res.status(200).json(cart);
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }
    
    async updateCartItemHandler(req,res){
        try{
            const user=await req.user;
            const cartItemId=req.params.cartItemId;
            const cartItemData=req.body;
            const {quantity}=cartItemData;

            if(quantity<=0){
                return res.status(400).json({error:"Quantity must be greater than zero"});
            }

            const updatedCartItem=await CartItemService.updateCartItem(
                user._id,
                cartItemId,
                cartItemData
            );
            const cart=await CartService.findUserCart(user);
            res.status(200).json(cart);
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }

    async applyCouponHandler(req,res){
        try{
            const user=await req.user;
            const cart=await CartService.applyCoupon(user, req.body.code);
            res.status(200).json(cart);
        }catch(error){
            res.status(400).json({error:error.message});
        }
    }

    async removeCouponHandler(req,res){
        try{
            const user=await req.user;
            const cart=await CartService.removeCoupon(user);
            res.status(200).json(cart);
        }catch(error){
            res.status(400).json({error:error.message});
        }
    }

}
module.exports=new CartController();
