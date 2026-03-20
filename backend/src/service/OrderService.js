const mongoose = require('mongoose');
const User = require('../models/user');
const Address = require('../models/Address');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderStatus = require('../domain/OrderStatus');
const PaymentStatus = require('../domain/PaymentStatus');
const SellerReportService = require('./SellerReportService');
const productService = require('./ProductService');
const paymentMethodUtils = require('../util/paymentMethod');

const PLATFORM_FEE = 20;
const SHIPPING_FEE = 99;
class OrderService{
    async createOrder(user,shippingAddress,cart,paymentMethod='RAZORPAY'){
        const userAddressIds = Array.isArray(user.address) ? user.address.map((id) => id.toString()) : [];
        const normalizedPaymentMethod = paymentMethodUtils.normalizePaymentMethod(paymentMethod);
        const isCashOnDelivery = paymentMethodUtils.isCashOnDelivery(paymentMethod);

        if (shippingAddress?._id) {
            const shippingAddressId = shippingAddress._id.toString();
            if (!userAddressIds.includes(shippingAddressId)) {
                user.address = [...(user.address || []), shippingAddress._id];
                await User.findByIdAndUpdate(user._id, { address: user.address });
            }
        }

        if(!shippingAddress._id){
            shippingAddress=await Address.create(shippingAddress);
            user.address = [...(user.address || []), shippingAddress._id];
            await User.findByIdAndUpdate(user._id, { address: user.address });
        }

        const itemsBySeller=cart.cartItems.reduce((acc,item)=>{
            const sellerId=(item.product?.sellerId?._id || item.product?.sellerId)?.toString();

            if (!sellerId) {
                return acc;
            }

            acc[sellerId]=acc[sellerId] || [];
            acc[sellerId].push(item);
            return acc
        },{})

        const orders=new Set();

        const sellerEntries = Object.entries(itemsBySeller);

        for(const [index, [sellerId,cartItems]] of sellerEntries.entries()){
            const productOrderTotal=cartItems.reduce((acc,item)=>{
                return acc+Number(item.sellingPrice || 0);
            },0);

            const platformFee = index === 0 ? PLATFORM_FEE : 0;
            const shippingFee = index === 0 ? SHIPPING_FEE : 0;
            const totalOrderPrice = productOrderTotal + platformFee + shippingFee;

            const totalItem=cartItems.length;

            const neworder=new Order({
                user:user._id,
                shippingAddress:shippingAddress._id,
                orderItems:[],
                totalMrpPrice:0,
                totalSellingPrice:totalOrderPrice,
                platformFee,
                shippingFee,
                totalItems:totalItem,
                seller:sellerId,
                orderStatus:isCashOnDelivery ? OrderStatus.PLACED : OrderStatus.PENDING,
                paymentMethod: normalizedPaymentMethod
            });

            const orderItems=await Promise.all(cartItems.map(async(cartItem)=>{
                const orderItem=new OrderItem({
                    product:cartItem.product._id,
                    quantity:cartItem.quantity,
                    mrpPrice:cartItem.mrpPrice,
                    sellingPrice:cartItem.sellingPrice,
                    size: String(cartItem.size || cartItem.product?.size || 'N/A'),
                    userId:cart.user._id,
                });
                const savedOrderItem=await orderItem.save();
                neworder.orderItems.push(savedOrderItem._id);
                neworder.totalMrpPrice+=Number(cartItem.mrpPrice || 0);
                return savedOrderItem;
            }));

            neworder.discount = Math.max(0, neworder.totalMrpPrice - productOrderTotal);

            const savedOrder=await neworder.save();
            if (isCashOnDelivery) {
                await productService.decreaseStockForOrderItems(orderItems);
            }
            orders.add(savedOrder);

        }
        return Array.from(orders);

    }

    async findOrderById(orderId){
        if(
            !mongoose.Types.ObjectId.isValid(orderId)
        ){
            throw new Error('Invalid order ID');
        }
        const order=await Order.findById(orderId)
        .populate([{path:"user"},{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}]);

        if(!order){
            throw new Error('Order not found');
        }
        return order;
    }

    async userOrdersHistory(userId){
        return await Order.find({user:userId})
        .populate([{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}])
        .sort({createdAt:-1});
    }

    async getSellerOrders(sellerId){
        return await Order.find({
            seller:sellerId,
            $or: [
                { paymentStatus: { $in: [PaymentStatus.COMPLETED, PaymentStatus.REFUNDED] } },
                { paymentMethod: 'COD' },
            ],
        })
        .populate([{path:"user"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}])
        .sort({createdAt:-1});
    }

    async applyCancelledOrderState(order, { markTransactionRefunded = true } = {}){
        if(!order){
            throw new Error('Order not found');
        }

        if (order.orderStatus === OrderStatus.DELIVERED) {
            throw new Error('Delivered orders cannot be cancelled or refunded');
        }

        const wasAlreadyCancelled = order.orderStatus === OrderStatus.CANCELLED;
        const wasRefunded = order.paymentStatus === PaymentStatus.REFUNDED;
        const shouldRefundNow = order.paymentStatus === PaymentStatus.COMPLETED && !wasRefunded;
        const shouldRestoreCodStock =
            !wasAlreadyCancelled &&
            paymentMethodUtils.isCashOnDelivery(order.paymentMethod);

        if (wasAlreadyCancelled && !shouldRefundNow) {
            return order;
        }

        const updateData = {
            orderStatus: OrderStatus.CANCELLED,
        };

        if (order.paymentStatus === PaymentStatus.COMPLETED || wasRefunded) {
            updateData.paymentStatus = PaymentStatus.REFUNDED;
        }

        const cancelledOrder = await Order.findByIdAndUpdate(order._id,updateData,{new:true}
        ).populate([{path:"user"},{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}]);

        if (!cancelledOrder) {
            throw new Error('Order not found');
        }

        const sellerId = cancelledOrder.seller?._id || cancelledOrder.seller;
        const sellerReport = await SellerReportService.getSellerReport(sellerId);

        if (!wasAlreadyCancelled) {
            sellerReport.canceledOrders = Number(sellerReport.canceledOrders || 0) + 1;
        }

        if (shouldRefundNow) {
            const totalAmount = Number(cancelledOrder.totalSellingPrice || 0);

            await productService.restoreStockForOrderItems(cancelledOrder.orderItems || []);
            sellerReport.totalRefunds =
                Number(sellerReport.totalRefunds || 0) + totalAmount;
            sellerReport.netEarnings = Math.max(
                0,
                Number(sellerReport.netEarnings || 0) - totalAmount,
            );

            if (markTransactionRefunded) {
                const TransactionService = require('./TransactionService');
                await TransactionService.markTransactionRefunded(cancelledOrder._id);
            }
        }

        if (shouldRestoreCodStock) {
            await productService.restoreStockForOrderItems(cancelledOrder.orderItems || []);
        }

        await SellerReportService.updateSellerReport(sellerReport);

        return cancelledOrder;
    }

    async cancelOrderBySeller(orderId,sellerId,{ markTransactionRefunded = true } = {}){
        const order=await this.findOrderById(orderId);
        const orderSellerId = order?.seller?._id || order?.seller;

        if(orderSellerId?.toString()!==sellerId.toString()){
            throw new Error('Unauthorized to cancel this order');
        }

        return await this.applyCancelledOrderState(order,{ markTransactionRefunded });
    }

    async updateOrderStatus(orderId,newStatus,sellerId){
        
        const order=await this.findOrderById(orderId);
        if(!order){
            throw new Error('Order not found');
        }

        const orderSellerId = order?.seller?._id || order?.seller;
        if(sellerId && orderSellerId?.toString()!==sellerId.toString()){
            throw new Error('Unauthorized to update this order');
        }

        if(order.orderStatus===OrderStatus.DELIVERED && newStatus!==OrderStatus.DELIVERED){
            throw new Error('Delivered orders cannot be updated');
        }

        if(newStatus===OrderStatus.CANCELLED){
            return await this.cancelOrderBySeller(orderId,sellerId);
        }

        if(order.orderStatus===OrderStatus.CANCELLED){
            return order;
        }

        order.orderStatus=newStatus;
        return await Order.findByIdAndUpdate(orderId,{orderStatus:newStatus},{new:true}
        ).populate([{path:"user"},{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}]);
    }

    async cancelOrder(orderId,user){
        
        const order=await this.findOrderById(orderId);
        if(user._id.toString()!==order.user._id.toString()){
            throw new Error('Unauthorized to cancel this order');
        }
        if(!order){
            throw new Error('Order not found');
        }
        return await this.applyCancelledOrderState(order);
    }

    async findOrderItemById(orderItemId){
        if(!mongoose.Types.ObjectId.isValid(orderItemId)){
            throw new Error('Invalid order item ID');
        }
        const orderItem=await OrderItem.findById(orderItemId).populate('product');
        if(!orderItem){
            throw new Error('Order item not found');
        }
        return orderItem;
    }

    async deleteOrderForUser(orderId, user) {
        const order = await this.findOrderById(orderId);

        if (user._id.toString() !== order.user._id.toString()) {
            throw new Error('Unauthorized to delete this order');
        }

        if (order.orderStatus !== OrderStatus.CANCELLED) {
            throw new Error('Only cancelled orders can be deleted');
        }

        await OrderItem.deleteMany({ _id: { $in: order.orderItems } });
        await Order.findByIdAndDelete(orderId);

        return { _id: orderId };
    }
}

module.exports=new OrderService();
