const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    title:{
        typeof:String,
        required:true,
        trim:true
    },
    description:{
        typeof:String,
        required:true,
        trim:true
    },
    mrpPrice:{
        typeof:Number,
        required:true
    },
    sellingPrice:{
        typeof:Number,
        required:true
    },
    category:{
        typeof:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    stock:{
        typeof:Number,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller',
        required:true
    },
    discountPercentage:{
        typeof:Number,
        required:true
    },
    color:{
        typeof:String,
        trim:true
    },
    size:{
        typeof:String,
        trim:true
    }

});
const Product=mongoose.model('Product',productSchema);
module.exports=Product;