const Seller=require('../model/Seller');
const VerificationCode=require('../model/VerificationCode');
const generateOTP=require('../util/generateOtp');

class AuthService{
    async sendLoginOTP(email){
        const seller=await Seller.findOne({email});
        if(!seller) throw new Error("Seller not found");
        const existingVerificcationCode= await VerificationCode.findOne({email});
        if(existingVerificcationCode){
            await VerificationCode.deleteOne({email});
        }
        const otp=generateOTP();
        const verificationCode=new VerificationCode({
            email:email,
            code:otp
        });
        await verificationCode.save();

        await sendVerificationEmail(
            email,
            "Your Login OTP for Thok Bazar",
            `Your One Time Password(OTP) for login is ${otp}. It is valid for 10 minutes.`
        );
    }
}