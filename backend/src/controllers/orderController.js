const OrderService=require('../service/OrderService');
const CartService=require('../service/CartService');
const PaymentService=require('../service/PaymentService');
const PaymentOrder = require('../models/paymentOrder');
const paymentMethodUtils = require('../util/paymentMethod');

class OrderController{
    async createOrder(req,res){
        const { shippingAddress } = req.body;
        const requestedPaymentMethod = req.query.paymentMethod || req.body.paymentMethod;
        const normalizedPaymentMethod = paymentMethodUtils.normalizePaymentMethod(requestedPaymentMethod);
        try{
            const user= await req.user;
            const cartData=await CartService.findUserCart(user);
            const orders=await OrderService.createOrder(user,shippingAddress,cartData,normalizedPaymentMethod);

            if (!orders.length) {
                return res.status(400).json({ message: 'Cart is empty or no valid seller found for checkout' });
            }

            const primaryOrder = orders[0] || null;
            
            const paymentOrder=await PaymentService.createOrder(user,orders,normalizedPaymentMethod);

            const response={};

            if(normalizedPaymentMethod === 'RAZORPAY'){
                const payment=await PaymentService.createRazorpaypaymentLink(user,paymentOrder.amount,primaryOrder?._id);
                response.paymentLink=payment.short_url || payment.url;
                response.paymentOrderId=paymentOrder._id;
                response.paymentMethod = 'RAZORPAY';

                await PaymentOrder.findByIdAndUpdate(paymentOrder._id,{
                    paymentLinkId:payment.id
                });
            } else {
                response.paymentOrderId = paymentOrder._id;
                response.paymentMethod = 'COD';
                await CartService.clearUserCart(user._id);
            }
            return res.status(201).json({order: primaryOrder, orders, paymentDetails:response});
            
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async getOrderById(req,res){
        const {orderId}=req.params;
        try{
            const order=await OrderService.findOrderById(orderId);
            return res.status(200).json({order});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async getOrderItemById(req,res,next){
        try{
            const {orderItemId}=req.params;
            const orderItem=await OrderService.findOrderItemById(orderItemId);
            return res.status(200).json({orderItem});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async userOrdersHistory(req,res){
        try{
            const user= await req.user;
            const orders=await OrderService.userOrdersHistory(user._id);
            return res.status(200).json({orders});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async getSellerOrders(req,res){
        try{
            const seller= await req.user;
            const orders=await OrderService.getSellerOrders(seller._id);
            return res.status(200).json({orders});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async updateOrderStatus(req,res){
        try{
            const {orderId}=req.params;
            const {newStatus}=req.body;
            const seller= await req.user;
            const order=await OrderService.updateOrderStatus(orderId,newStatus,seller._id);
            return res.status(200).json({order});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async cancelOrder(req,res){
        try{
            const {orderId}=req.params;
            const user= await req.user;
            const order=await OrderService.cancelOrder(orderId,user);
            return res.status(200).json({order});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }

    async deleteOrder(req,res){
        try{
            const {orderId}=req.params;
            const user= await req.user;
            const deletedOrder=await OrderService.deleteOrderForUser(orderId,user);
            return res.status(200).json({order:deletedOrder});
        }catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}

module.exports=new OrderController();
