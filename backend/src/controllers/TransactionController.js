// const TransactionService = require('../service/TransactionService');

const TransactionService = require("../service/TransactionService");


class TransactionController {

    async getTransactionsBySeller(req, res) {
        try{
            const seller=await req.user;
            const transactions=await TransactionService.getTransactionsBySeller(seller._id);
            return res.status(200).json({transactions:transactions});

        }catch(error){
            console.error('Error fetching transactions by seller:',error);
            return res.status(500).json({message:'Internal server error'});
        }
    }

    async refundTransactionBySeller(req, res) {
        try {
            const seller = await req.user;
            const { transactionId } = req.params;
            const transaction = await TransactionService.refundTransactionBySeller(transactionId, seller._id);
            return res.status(200).json({ transaction });
        } catch (error) {
            console.error('Error refunding transaction by seller:', error);
            return res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

}
module.exports=new TransactionController();
