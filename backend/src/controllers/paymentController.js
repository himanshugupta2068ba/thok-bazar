const paymentService=require('../service/PaymentService');
const OrderService=require('../service/OrderService');
const SellerService=require('../service/SellerService');
const TransactionService=require('../service/TransactionService');
const SellerReportService=require('../service/SellerReportService');
const Cart=require('../models/Cart');

const paymentSucessHandler=async(req,res)=>{
    const paymentLinkId=
        req.params.paymentLinkId ||
        req.query.razorpay_payment_link_id ||
        req.query.paymentLinkId ||
        req.body.paymentLinkId;
    const paymentId=req.query.razorpay_payment_id || req.body.paymentId;
    try{
        if(!paymentLinkId || !paymentId){
            return res.status(400).json({message:'Missing payment identifiers'});
        }

        const user=req.user;
        const paymentOrder=await paymentService.getPaymentOrdersByPaymentLinkId(paymentLinkId);
        const paymentSuccess=await paymentService.proceedPaymentOrder(paymentOrder,paymentLinkId,paymentId);
        if(paymentSuccess){
            for(let orderId of paymentOrder.orders){
                const order=await OrderService.findOrderById(orderId);

                await TransactionService.createTransaction(user._id,order._id,order.seller);

                const seller=await SellerService.getSellerById(order.seller);

                const sellerReport=await SellerReportService.getSellerReport(seller._id);

                sellerReport.totalEarnings+=order.totalSellingPrice;
                sellerReport.totalSales+=1;
                sellerReport.totalOrders+=1;
                sellerReport.netEarnings+=order.totalSellingPrice - Number(order.taxAmount || 0);
                
                await SellerReportService.updateSellerReport(sellerReport);

            }
            await Cart.findOneAndUpdate({user:user._id},{cartItems:[]},{new:true});

            return res.status(200).json({
                message:'Payment successful and order processed',
                orderIds: paymentOrder.orders,
                orderId: paymentOrder.orders?.[0] || null,
            });
        }else{
        return res.status(400).json({message:'Payment failed'});
    }
} catch(error){
        console.error('Error processing payment success:',error);
        return res.status(500).json({message:'Internal server error'});
    }
}
module.exports={paymentSucessHandler};