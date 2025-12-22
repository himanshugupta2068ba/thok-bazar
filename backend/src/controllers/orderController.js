const OrderService=require('../service/OrderService');
const CartService=require('../service/CartService');
const PaymentService=require('../service/PaymentService');
const PaymentOrder = require('../models/paymentOrder');

class OrderController{

    async createOrder(req,res){
        const {shippingAddress,cart}=req.body;
        const {paymentMethod}=req.query;
        const jwtUser=req.headers.authorization;
        try{
            const user= await req.user;
            const cart=await CartService.findUserCart(user);
            const order=await OrderService.createOrder(user,shippingAddress,cart,paymentMethod);
            
            const paymentOrder=await PaymentService.createOrder(user,[order]);

            const response={};

            if(paymentMethod==='razorpay'){
                const payment=await PaymentService.createRazorpaypaymentLink(user,paymentOrder.amount,order._id);
                response.paymentLink=payment.short_url;
                response.paymentOrderId=paymentOrder._id;

                await PaymentOrder.findByIdAndUpdate(paymentOrder._id,{
                    paymentLinkId:payment.id
                });
            }
            return res.status(201).json({order,paymentDetails:response});
            
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
            const order=await OrderService.updateOrderStatus(orderId,newStatus);
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
}

module.exports=new OrderController();