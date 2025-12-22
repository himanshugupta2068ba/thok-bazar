const Transaction = require('../model/Transaction');
const OrderService = require('./OrderService');
const SellerService = require('./SellerService');


class TransactionService {
    // Transaction related methods would go here

    async createTransaction(customerId, orderId, sellerId) {

        const order = await OrderService.findOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        const seller = await SellerService.getSellerById(sellerId);
        if (!seller) {
            throw new Error('Seller not found');
        }

        const transaction = new Transaction({
            customer: customerId,
            order: orderId,
            seller: sellerId
        });
        return await transaction.save();
    }

    async getTransactionsBySeller(sellerId) {
        return await Transaction.find({ seller: sellerId }).populate('customer').populate('order');
    }

    async getAllTransactions() {
        return await Transaction.find().populate('customer').populate('order').populate('seller');
    }
}
module.exports = new TransactionService();