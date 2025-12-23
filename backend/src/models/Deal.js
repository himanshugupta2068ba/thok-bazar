const moongoose=require('mongoose');

const dealSchema=new moongoose.Schema({
    discount:{
        typeo:Number,
        required:true
    },
    category:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'HomeCategory',
        required:true
    }
});
const Deal=moongoose.model('Deal',dealSchema);
module.exports=Deal;