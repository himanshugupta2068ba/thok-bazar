const User = require('../models/user');
const Address = require('../models/address');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
class OrderService{
    async createOrder(user,shippingAddress,cart){
        if(shippingAddress._id && !user.addresses.includes(shippingAddress.id)){
              user.addresses.push(shippingAddress._id);
              await User.findByIdAndUpdate(user._id,user);
        }

        if(!shippingAddress.Id){
            shippingAddress=await Address.create(shippingAddress)
        }

        const itemsBySeller=cart.cartItems.reduce((acc,item)=>{
            const sellerId=item.product.seller._id.toString();

            acc[sellerId]=acc[sellerId] || [];
            acc[sellerId].push(item);
            return acc
        },{})

        const orders=new Set();

        for(const [sellerId,cartItems] of Object.entries(itemsBySeller)){
            const totalOrderPrice=cartItems.reduce((acc,item)=>{
                return acc+item.quantity*item.sellingPrice;
            },0);

            const totalItem=cartItems.length;

            const neworder=new Order({
                user:user._id,
                shippingAddress:shippingAddress._id,
                orderItems:[],
                totalMrpPrice:0,
                totalSellingPrice:totalOrderPrice,
                totalItems:totalItem,
                seller:sellerId,
                orderStatus:'Processing'
            });

            const orderItems=await Promise.all(cartItems.map(async(cartItem)=>{
                const orderItem=new OrderItem({
                    product:cartItem.product._id,
                    quantity:cartItem.quantity,
                    mrpPrice:cartItem.mrpPrice,
                    sellingPrice:cartItem.sellingPrice,
                    size:cartItem.size,
                    userId:cart.user._id,
                });
                const savedOrderItem=await orderItem.save();
                neworder.orderItems.push(savedOrderItem._id);
                neworder.totalMrpPrice+=cartItem.mrpPrice*cartItem.quantity;
                return savedOrderItem;
            }));

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
        return await Order.findOne({user:userId})
        .populate([{path:"seller"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}])
        .sort({createdAt:-1});
    }

    async getSellerOrders(sellerId){
        return await Order.find({seller:sellerId})
        .populate([{path:"user"},{path:"orderItems",populate:{path:"product"}},{path:"shippingAddress"}])
        .sort({createdAt:-1});
    }
}