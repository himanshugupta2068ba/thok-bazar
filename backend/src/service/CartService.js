const Cart=require("../models/Cart")
const CartItem=require("../models/CartItems")
const CouponService = require("./CouponService");
const ProductService = require("./ProductService");
const { buildCartPricing, roundCurrency } = require("../util/checkoutPricing");

const cartItemPopulateConfig = {
    path: "product",
    populate: {
        path: "sellerId",
        select: "sellerName businessDetails",
    },
};

class CartService{
    clearCouponFields(cart){
        cart.couponCode = null;
        cart.couponDiscountAmount = 0;
        cart.couponDiscountPercentage = 0;
    }

    async buildDealAwareCartItems(cartItems = []) {
        if (!Array.isArray(cartItems) || !cartItems.length) {
            return [];
        }

        const products = cartItems
            .map((cartItem) => cartItem?.product)
            .filter(Boolean);
        const dealAwareProducts = await ProductService.applyDealsToProductCollection(products);
        const productMap = new Map(
            dealAwareProducts.map((product) => [String(product?._id || ''), product]),
        );

        return await Promise.all(
            cartItems.map(async (cartItem) => {
                const quantity = Number(cartItem?.quantity || 0);
                const productId = String(cartItem?.product?._id || cartItem?.product || '');
                const resolvedProduct =
                    productMap.get(productId) ||
                    (cartItem?.product?.toObject ? cartItem.product.toObject() : cartItem?.product) ||
                    null;
                const nextMrpPrice = roundCurrency(Number(resolvedProduct?.mrpPrice || 0) * quantity);
                const unitSellingPrice = Number(
                    resolvedProduct?.effectiveSellingPrice ??
                    resolvedProduct?.dealSellingPrice ??
                    resolvedProduct?.sellingPrice ??
                    0,
                );
                const nextSellingPrice = roundCurrency(unitSellingPrice * quantity);

                if (
                    Number(cartItem?.mrpPrice || 0) !== nextMrpPrice ||
                    Number(cartItem?.sellingPrice || 0) !== nextSellingPrice
                ) {
                    cartItem.mrpPrice = nextMrpPrice;
                    cartItem.sellingPrice = nextSellingPrice;
                    await cartItem.save();
                }

                const normalizedCartItem = cartItem?.toObject ? cartItem.toObject() : { ...cartItem };

                return {
                    ...normalizedCartItem,
                    product: resolvedProduct,
                    mrpPrice: nextMrpPrice,
                    sellingPrice: nextSellingPrice,
                };
            }),
        );
    }

    async loadCartWithItems(userId){
        const cart=await Cart.findOne({user:userId});

        if(!cart){
            throw new Error("Cart not found");
        }

        const cartItems=await CartItem.find({cart:cart._id}).populate(cartItemPopulateConfig);

        return { cart, cartItems };
    }

    async syncCartState(cart, cartItems){
        const syncedCartItems = await this.buildDealAwareCartItems(cartItems);
        let couponResult = null;
        const pricingWithoutCoupon = buildCartPricing({ cartItems: syncedCartItems });

        if (cart.couponCode && pricingWithoutCoupon.totalItems > 0) {
            try {
                couponResult = await CouponService.applyCoupon(cart.couponCode, pricingWithoutCoupon.orderValue);
            } catch (error) {
                this.clearCouponFields(cart);
            }
        } else if (!pricingWithoutCoupon.totalItems && cart.couponCode) {
            this.clearCouponFields(cart);
        }

        const pricing = buildCartPricing({ cartItems: syncedCartItems, couponResult });

        cart.cartItems = cartItems.map((cartItem)=>cartItem._id);
        cart.totalMrpPrice = pricing.totalMrpPrice;
        cart.totalSellingPrice = pricing.totalSellingPrice;
        cart.totalItems = pricing.totalItems;
        cart.discount = pricing.discount;
        cart.couponCode = pricing.couponCode;
        cart.couponDiscountAmount = pricing.couponDiscountAmount;
        cart.couponDiscountPercentage = pricing.couponDiscountPercentage;

        await cart.save();

        return {
            _id: cart._id,
            user: cart.user,
            cartItems: syncedCartItems,
            totalMrpPrice: pricing.totalMrpPrice,
            totalSellingPrice: pricing.totalSellingPrice,
            totalItems: pricing.totalItems,
            discount: pricing.discount,
            productDiscountAmount: pricing.productDiscountAmount,
            platformFee: pricing.platformFee,
            shippingFee: pricing.shippingFee,
            orderValue: pricing.orderValue,
            payableAmount: pricing.payableAmount,
            couponCode: pricing.couponCode,
            couponDiscountAmount: pricing.couponDiscountAmount,
            couponDiscountPercentage: pricing.couponDiscountPercentage,
            appliedCoupon: pricing.appliedCoupon,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
   
    async findUserCart(user){
        const { cart, cartItems } = await this.loadCartWithItems(user._id);
        return await this.syncCartState(cart, cartItems);
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

    async clearUserCart(userId){
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return null;
        }

        await CartItem.deleteMany({ cart: cart._id });

        cart.cartItems = [];
        cart.totalMrpPrice = 0;
        cart.totalSellingPrice = 0;
        cart.totalItems = 0;
        cart.discount = 0;
        this.clearCouponFields(cart);

        await cart.save();

        return cart;
    }

    async applyCoupon(user, code){
        const { cart, cartItems } = await this.loadCartWithItems(user._id);
        const syncedCartItems = await this.buildDealAwareCartItems(cartItems);
        const pricingWithoutCoupon = buildCartPricing({ cartItems: syncedCartItems });

        if (!pricingWithoutCoupon.totalItems) {
            throw new Error("Add items to your cart before applying a coupon");
        }

        const couponResult = await CouponService.applyCoupon(code, pricingWithoutCoupon.orderValue);

        cart.couponCode = couponResult?.coupon?.code || null;
        cart.couponDiscountAmount = Number(couponResult?.discountAmount || 0);
        cart.couponDiscountPercentage = Number(couponResult?.coupon?.discount || 0);
        await cart.save();

        return await this.syncCartState(cart, cartItems);
    }

    async removeCoupon(user){
        const { cart, cartItems } = await this.loadCartWithItems(user._id);
        this.clearCouponFields(cart);
        await cart.save();
        return await this.syncCartState(cart, cartItems);
    }
}

module.exports=new CartService();
