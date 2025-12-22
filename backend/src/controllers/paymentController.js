const paymentService=require('../services/paymentService');
const OrderService=require('../services/OrderService');
const SellerService=require('../services/SellerService');
const TransactionService=require('../services/TransactionService');
const SellerReportService=require('../services/SellerReportService');

const paymentSucessHandler=async(req,res)=>{
    const{paymentLinkId,paymentId}=req.body;
    try{
        const user=req.user;
        const paymentOrder=await paymentService.getPaymentOrdersByPaymentLinkId(paymentLinkId);
        const paymentSuccess=await paymentService.proceedPaymentOrder(paymentOrder,paymentLinkId,paymentId);
        if(paymentSuccess){
            for(let orderId of paymentOrder.orders){
                const order=await OrderService.findOrderById(orderId);

                await TransactionService.createTransaction(user._id,order._id,order.seller);

                const seller=await SellerService.getSellerById(order.seller);

                const sellerReport=await SellerReportrService.getSellerReport(seller);

                sellerReport.totalEarnings+=order.totalSellingPrice;
                sellerReport.totalSales+=1;
                sellerReport.totalOrders+=1;
                sellerReport.netEarnings+=order.totalSellingPrice - order.taxAmount;
                
                const updatedSellerReport=await SellerReportService.updateSellerReport(sellerReport);

            }
            await Cart.findOneAndUpdate({user:user._id},{items:[]},{new:true});

            return res.status(200).json({message:'Payment successful and order processed'});
        }else{
        return res.status(400).json({message:'Payment failed'});
    }
} catch(error){
        console.error('Error processing payment success:',error);
        return res.status(500).json({message:'Internal server error'});
    }
}
module.exports={paymentSucessHandler};