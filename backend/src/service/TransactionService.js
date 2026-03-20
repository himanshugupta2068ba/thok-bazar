const Transaction = require('../models/Transaction');
const OrderService = require('./OrderService');
const SellerService = require('./SellerService');
const PaymentStatus = require('../domain/PaymentStatus');
const mongoose = require('mongoose');


class TransactionService {
    // Transaction related methods would go here

    async createTransaction(customerId, orderId, sellerId, transactionId = null, paymentLinkId = null) {

        const order = await OrderService.findOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        const seller = await SellerService.getSellerById(sellerId);
        if (!seller) {
            throw new Error('Seller not found');
        }

        const existingTransaction = await Transaction.findOne({ order: orderId, seller: sellerId });
        if (existingTransaction) {
            return existingTransaction;
        }

        const transaction = new Transaction({
            customer: customerId,
            order: orderId,
            seller: sellerId,
            transactionId,
            paymentLinkId,
            status: 'RECEIVED',
        });
        return await transaction.save();
    }

    async markTransactionRefunded(orderId) {
        return await Transaction.findOneAndUpdate(
            { order: orderId, status: { $ne: 'REFUNDED' } },
            { status: 'REFUNDED' },
            { new: true }
        );
    }

    async refundTransactionBySeller(transactionId, sellerId) {
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            throw new Error('Invalid transaction ID');
        }

        const transaction = await Transaction.findOne({
            _id: transactionId,
            seller: sellerId,
        }).populate('customer').populate('order');

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        if (!transaction.order?._id) {
            throw new Error('Linked order not found for this transaction');
        }

        await OrderService.cancelOrderBySeller(transaction.order._id, sellerId, {
            markTransactionRefunded: false,
        });

        if (transaction.status !== 'REFUNDED') {
            transaction.status = 'REFUNDED';
            await transaction.save();
        }

        return await Transaction.findById(transaction._id)
            .populate('customer')
            .populate('order');
    }

    async getTransactionsBySeller(sellerId) {
        const transactions = await Transaction.find({ seller: sellerId })
            .populate('customer')
            .populate({
                path: 'order',
                match: {
                    paymentStatus: { $in: [PaymentStatus.COMPLETED, PaymentStatus.REFUNDED] },
                    totalSellingPrice: { $gt: 0 },
                },
            })
            .sort({ createdAt: -1 });

        return transactions.filter((transaction) => Boolean(transaction.order));
    }

    async getAllTransactions() {
        return await Transaction.find().populate('customer').populate('order').populate('seller');
    }
}
module.exports = new TransactionService();
