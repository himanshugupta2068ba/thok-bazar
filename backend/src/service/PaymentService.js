const { default: customers } = require('razorpay/dist/types/customers');
const PaymentOrder=require('../models/paymentOrder');
const razorpay=require('../config/razorpayClient');
const PaymentStatus=require('../domain/PaymentStatus');

class PaymentService{
  

    async createOrder(user,orders){
        constount=orders.reduce((acc,order)=>{
            return acc+order.totalSellingPrice;
        },0);

        const paymentOrder=new PaymentOrder({
            amount:totalAmount,
            user:user._id,
            order:orders.map(order=>order._id),
            paymentMethod:'razorpay'
        });

        return await paymentOrder.save();
    }

    async getPaymentOrderById(paymentOrderId){
        const paymentOrder=await PaymentOrder.findOne(paymentOrderId);
        if(!paymentOrder){
            throw new Error('Payment order not found');
        }
        return paymentOrder;

    }

    async getPaymentOrdersByPaymentLinkId(paymentLinkId){
        const paymentOrders=await PaymentOrder.findOne({paymentLinkId:paymentLinkId});
        if(!paymentOrders){
            throw new Error('Payment orders not found for the given payment link ID');
        }
        return paymentOrders;
    }


   async proceedPaymentOrder(paymentOrder,paymentLinkId,paymentId){
    if(paymentOrder.status===PaymentStatus.PENDING){
       const payment=await razorpay.payments.fetch(paymentId);
         if(payment.status==='captured'){
            await Promise.all(paymentOrder.order.map(async(orderId)=>{
                const order=await Order.findById(orderId);
                order.orderStatus='Paid';
                await order.save();
            }));
            paymentOrder.status=PaymentStatus.SUCCESS;
            await paymentOrder.save();
            return true;
        }else{
            paymentOrder.status=PaymentStatus.FAILED;
            await paymentOrder.save();
            return false;
        }
    }
    return false;

   }

    async createrazorpaypaymentLink(user,amount,orderId){
        try{
            const paymentLinkRequest={
                amount:amount*100,
                currency:'INR',
                accept_partial:false,
                customer:{
                    name:user.name,
                    email:user.email,
                },
                notify:{
                    email:true,
                },
                callback_url:`${process.env.FRONTEND_URL}/payment/success`,
                callback_method:'get'
            }
            const paymentLink=await razorpay.paymentLink.create(paymentLinkRequest);
            return paymentLink;
        }catch(error){
            throw new Error('Error creating Razorpay payment link: '+error.message);
        }

    }
}
module.exports=new PaymentService();