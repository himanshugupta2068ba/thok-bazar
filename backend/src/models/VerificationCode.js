const { Schema, default: mongoose } = require("mongoose");

const verificationCodeSchem=new Schema({
    otp:{
        type:String,
    },
    email:{
        type:String,
        require:true
    },
})

const VerificationCode=mongoose.model("Verification",verificationCodeSchem)
module.exports=VerificationCode;