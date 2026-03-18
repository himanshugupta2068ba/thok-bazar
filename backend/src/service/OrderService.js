const mongoose = require('mongoose');
const User = require('../models/user');
const Address = require('../models/Address');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderStatus = require('../domain/OrderStatus');

const PLATFORM_FEE = 20;
const SHIPPING_FEE = 99;
class OrderService{
    async createOrder(user,shippingAddress,cart){
        const userAddressIds = Array.isArray(user.address) ? user.address.map((id) => id.toString()) : [];

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
                orderStatus:OrderStatus.PENDING
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
        .populate([{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}]);

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
        return await Order.find({seller:sellerId})
        .populate([{path:"user"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}])
        .sort({createdAt:-1});
    }

    async updateOrderStatus(orderId,newStatus){
        
        const order=await this.findOrderById(orderId);
        if(!order){
            throw new Error('Order not found');
        }
        order.orderStatus=newStatus;
        return await Order.findByIdAndUpdate(orderId,{orderStatus:newStatus},{new:true}
        ).populate([{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}]);
    }

        async cancelOrder(orderId,user){
        
        const order=await this.findOrderById(orderId);
        if(user._id.toString()!==order.user._id.toString()){
            throw new Error('Unauthorized to cancel this order');
        }
        if(!order){
            throw new Error('Order not found');
        }
        order.orderStatus=OrderStatus.CANCELLED;
        return await Order.findByIdAndUpdate(orderId,{orderStatus:OrderStatus.CANCELLED},{new:true}
        ).populate([{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}]);
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