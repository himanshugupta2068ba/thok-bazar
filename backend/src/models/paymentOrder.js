const mongoose=require('mongoose');
const PaymentStatus=require('../domain/PaymentStatus');
const orderController = require('../controllers/orderController');

const paymentOrerSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:Object.values(PaymentStatus),
        default:PaymentStatus.PENDING
    },
    paymentMethod:{
        type:String,
        default:'razorpay'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order'
    }]
})

const PaymentOrder=mongoose.model('PaymentOrder',paymentOrerSchema);
module.exports=PaymentOrder;