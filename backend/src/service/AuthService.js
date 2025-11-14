const Seller=require('../models/Seller');
const VerificationCode=require('../models/VerificationCode');
const generateOTP=require('../util/generateOtp');
const sendVerificationEmail=require('../util/sendEmail.js');
const jwtprovider = require("../util/jwtprovider");
const User = require('../models/user');

class AuthService{
    async sendLoginOTP(email){

       const SIGNIN_PREFIX="signin_";
       if(email.startsWith(SIGNIN_PREFIX)){
        email=email.substring(SIGNIN_PREFIX.length);
        const seller=await Seller.findOne({email});
        const user=await User.findOne({email});
        if(!seller && !user) throw new Error("Seller or User not found");
       }

        const existingVerificationCode= await VerificationCode.findOne({email});

        if(existingVerificationCode){
            await VerificationCode.deleteOne({email});
            // console.log("Existing verification code deleted");
        }

        const otp=generateOTP();
        const verificationCode=new VerificationCode({
            email:email,
            otp:otp
        });
        await verificationCode.save();

        await sendVerificationEmail(
            email,
            "Your Login OTP for Thok Bazar",
            `Your One Time Password(OTP) for login is ${otp}. It is valid for 10 minutes.`
        );
    }

    // async createUser(req){

    // }
}
module.exports=new AuthService();