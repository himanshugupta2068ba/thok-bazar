const SellerReport=require('../models/SellerReport');

class SellerReportService{

    async getSellerReport(sellerId){
        try{
        let sellerReport=await SellerReport.findOne({seller:sellerId});
        if(!sellerReport){
            sellerReport=new SellerReport({seller:sellerId,
            totalEarnings:0,
            totalSales:0,
            totalOrders:0,
            });
            sellerReport=await sellerReport.save();
        }
        return sellerReport;
    }
    catch(error){
        throw new Error('Error fetching seller report: '+error.message);
    }
}

async updateSellerReport(sellerReport){
    try{
        return await sellerReport.findByIdAndUpdate(sellerReport._id,sellerReport,{new:true});
    }catch(error){
        throw new Error('Error updating seller report: '+error.message);
    }
}

}
module.exports=new SellerReportService();