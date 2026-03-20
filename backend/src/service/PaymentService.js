// // const { default: customers } = require('razorpay/dist/types/customers');
// const Razorpay = require("razorpay");
// const PaymentOrder=require('../models/paymentOrder');
// const razorpay=require('../config/razorpayClient');
// const PaymentStatus=require('../domain/PaymentStatus');
// const Order = require('../models/Order');

// class PaymentService{
  

//     async createOrder(user,orders){
//         const totalAmount = orders.reduce((acc,order)=>{
//             return acc+order.totalSellingPrice;
//         },0);

//         const paymentOrder=new PaymentOrder({
//             amount:totalAmount,
//             user:user._id,
//             orders:orders.map(order=>order._id),
//             paymentMethod:'razorpay'
//         });

//         return await paymentOrder.save();
//     }

//     async getPaymentOrderById(paymentOrderId){
//         const paymentOrder=await PaymentOrder.findOne(paymentOrderId);
//         if(!paymentOrder){
//             throw new Error('Payment order not found');
//         }
//         return paymentOrder;

//     }

//     async getPaymentOrdersByPaymentLinkId(paymentLinkId){
//         const paymentOrders=await PaymentOrder.findOne({paymentLinkId:paymentLinkId});
//         if(!paymentOrders){
//             throw new Error('Payment orders not found for the given payment link ID');
//         }
//         return paymentOrders;
//     }


//    async proceedPaymentOrder(paymentOrder,paymentLinkId,paymentId){
//     if(paymentOrder.status===PaymentStatus.PENDING){
//        const payment=await razorpay.payments.fetch(paymentId);
//          if(payment.status==='captured'){
//                         await Promise.all(paymentOrder.orders.map(async(orderId)=>{
//                 const order=await Order.findById(orderId);
//                 order.orderStatus='Paid';
//                 await order.save();
//             }));
//             paymentOrder.status=PaymentStatus.SUCCESS;
//             await paymentOrder.save();
//             return true;
//         }else{
//             paymentOrder.status=PaymentStatus.FAILED;
//             await paymentOrder.save();
//             return false;
//         }
//     }
//     return false;

//    }

// //     async createRazorpaypaymentLink(user,amount,orderId){
// //         try{
// //             const paymentLinkRequest={
// //                 amount:amount*100,
// //                 currency:'INR',
// //                 accept_partial:false,
// //                 customer:{
// //                     name:user.name,
// //                     email:user.email,
// //                 },
// //                 notify:{
// //                     email:true,
// //                 },
// //                 callback_url:`${process.env.FRONTEND_URL}/payment/success`,
// //                 callback_method:'get'
// //             }
// //             const paymentLink=await razorpay.paymentLink.create(paymentLinkRequest);
// //             return paymentLink;
// //         }catch (error) {
// //   console.error("Error creating Razorpay payment link:", error);
// // }

// //     }
// async createRazorpaypaymentLink(user, amount, orderId) {
//   try {

//     const paymentLinkRequest = {
//       amount: amount * 100,
//       currency: "INR",
//       accept_partial: false,
//       customer: {
//         name: user.name,
//         email: user.email,
//       },
//       notify: {
//         email: true,
//       },
//       callback_url: `${process.env.FRONTEND_URL}/payment/success`,
//       callback_method: "get",
//     };

//     const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

//     return paymentLink;

//   } catch (error) {

//     console.error("Error creating Razorpay payment link:", error);

//     throw new Error("Razorpay payment link creation failed");

//   }
// }
// }
// module.exports=new PaymentService();
const PaymentOrder = require("../models/paymentOrder");
const razorpay = require("../config/razorpayClient");
const PaymentStatus = require("../domain/PaymentStatus");
const Order = require("../models/Order");
const OrderStatus = require("../domain/OrderStatus");
const productService = require("./ProductService");
const paymentMethodUtils = require("../util/paymentMethod");

const FRONTEND_CALLBACK_BASE = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

class PaymentService {
  // Create payment order in DB
  async createOrder(user, orders, paymentMethod = "RAZORPAY") {

    if (!Array.isArray(orders) || !orders.length) {
      throw new Error("Cannot create payment order for empty order list");
    }

    const totalAmount = orders.reduce((acc, order) => {
      return acc + order.totalSellingPrice;
    }, 0);

    if (!totalAmount || totalAmount <= 0) {
      throw new Error("Invalid payable amount for payment order");
    }

    const paymentOrder = new PaymentOrder({
      amount: totalAmount,
      user: user._id,
      orders: orders.map(order => order._id),
      paymentMethod: paymentMethodUtils.toPaymentOrderMethod(paymentMethod),
      status: PaymentStatus.PENDING
    });

    return await paymentOrder.save();
  }


  // Get payment order by ID
  async getPaymentOrderById(paymentOrderId) {

    const paymentOrder = await PaymentOrder.findById(paymentOrderId);

    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }

    return paymentOrder;
  }


  // Get payment order by Razorpay payment link
  async getPaymentOrdersByPaymentLinkId(paymentLinkId) {

    const paymentOrder = await PaymentOrder.findOne({
      paymentLinkId: paymentLinkId
    });

    if (!paymentOrder) {
      throw new Error("Payment order not found for given payment link");
    }

    return paymentOrder;
  }


  // Process payment result
  async proceedPaymentOrder(paymentOrder, paymentLinkId, paymentId) {

    // Idempotent behavior: if already completed, treat as success.
    if (paymentOrder.status === PaymentStatus.COMPLETED) {
      return true;
    }

    if (paymentOrder.status !== PaymentStatus.PENDING) {
      return false;
    }

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === "captured") {

      await Promise.all(
        paymentOrder.orders.map(async (orderId) => {

          const order = await Order.findById(orderId).populate("orderItems");

          if (order) {
            await productService.decreaseStockForOrderItems(order.orderItems || []);
            order.orderStatus = OrderStatus.PLACED;
            order.paymentStatus = PaymentStatus.COMPLETED;
            await order.save();
          }

        })
      );

      paymentOrder.status = PaymentStatus.COMPLETED;
      paymentOrder.paymentLinkId = paymentLinkId;

      await paymentOrder.save();

      return true;

    } else {
      await Promise.all(
        paymentOrder.orders.map(async (orderId) => {
          const order = await Order.findById(orderId);

          if (order) {
            order.paymentStatus = PaymentStatus.FAILED;
            order.orderStatus = OrderStatus.CANCELLED;
            await order.save();
          }
        })
      );

      paymentOrder.status = PaymentStatus.FAILED;
      await paymentOrder.save();

      return false;
    }
  }


  // Create Razorpay Payment Link
  async createRazorpaypaymentLink(user, amount, orderId) {

    try {
      if (!orderId) {
        throw new Error("Order ID is required to create payment link");
      }

      if (!amount || amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const normalizedContact = String(user.mobile || user.phone || "")
        .replace(/\D/g, "")
        .slice(-10);

      const customer = {
        name: user.name,
        email: user.email,
      };

      if (/^\d{10}$/.test(normalizedContact)) {
        customer.contact = normalizedContact;
      }

      const paymentLinkRequest = {
        amount: Math.round(amount * 100), // Razorpay uses paise
        currency: "INR",

        reference_id: orderId.toString(),
        description: `Order #${orderId}`,

        accept_partial: false,

        customer,

        notify: {
          sms: true,
          email: true
        },

        callback_url: `${FRONTEND_CALLBACK_BASE}/payment/success`,
        callback_method: "get"
      };

      const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

      return paymentLink;

    } catch (error) {

      console.error(
        "Razorpay Payment Link Error:",
        JSON.stringify(error, null, 2)
      );

      throw new Error("Razorpay payment link creation failed");
    }
  }
}

module.exports = new PaymentService();
