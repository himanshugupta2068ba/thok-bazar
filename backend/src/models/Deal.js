const mongoose=require('mongoose');

const dealSchema=new mongoose.Schema({
    discount:{
        type:Number,
        required:true,
        min:1,
        max:100
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HomeCategory',
        required:true
    },
    productIds:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Product',
        default:[]
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, { timestamps: true });
const Deal=mongoose.model('Deal',dealSchema);
module.exports=Deal;