const TransactionService = require('../services/TransactionService');


class TransactionController {

    async getTransactionsBySeller(req, res) {
        try{
            const seller=await req.seller;
            const transactions=await TransactionService.getTransactionsBySeller(seller._id);
            return res.status(200).json({transactions:transactions});

        }catch(error){
            console.error('Error fetching transactions by seller:',error);
            return res.status(500).json({message:'Internal server error'});
        }
    }

}
module.exports=new TransactionController();