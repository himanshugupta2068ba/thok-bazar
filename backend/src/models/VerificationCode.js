const { Schema, default: mongoose } = require("mongoose");

const verificationCodeSchem=new Schema({
    email:{
        type:String,
        require:true
    },
    otp:{
        type:String,
    }
})

const VerificationCode=mongoose.model("Verification",verificationCodeSchem)
module.exports=VerificationCode;