const { Schema, mongo, default: mongoose } = require("mongoose");

const cartItemsSchema=new Schema({
    cart:{
        type:Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    size:{
        type:String,
        reuired:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    mrpPrice:{
        type:Number,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }

})
const CartItem=mongoose.model("CartItem",cartItemsSchema);
module.exports=CartItem