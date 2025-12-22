const SellerReportService = require('../services/sellerReportService');

class SellerReportController {
    
    async getSellerReport(req, res) {
        try {
            const seller = await req.seller;
            const sellerReport = await SellerReportService.getSellerReport(seller._id);
            return res.status(200).json({ sellerReport: sellerReport });
        } catch (error) {
            console.error('Error fetching seller report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
module.exports = new SellerReportController();