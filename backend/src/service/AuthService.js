const Seller=require('../models/Seller');
const VerificationCode=require('../models/VerificationCode');
const generateOTP=require('../util/generateOtp');
const sendVerificationEmail=require('../util/sendEmail.js');
const User = require('../models/user');

class AuthService{
    async sendLoginOTP(email){
    const validator = require("validator");
    const SIGNIN_USER_PREFIX = "signin_user_";
    const SIGNIN_SELLER_PREFIX = "signin_seller_";
    const LEGACY_SIGNIN_PREFIX = "signin_";

    if (!email || typeof email !== "string") {
      throw new Error("Invalid email format");
    }

    let loginType = null;
    let normalizedEmail = email.trim();

    if (normalizedEmail.startsWith(SIGNIN_USER_PREFIX)) {
      loginType = "user";
      normalizedEmail = normalizedEmail.substring(SIGNIN_USER_PREFIX.length);
    } else if (normalizedEmail.startsWith(SIGNIN_SELLER_PREFIX)) {
      loginType = "seller";
      normalizedEmail = normalizedEmail.substring(SIGNIN_SELLER_PREFIX.length);
    } else if (normalizedEmail.startsWith(LEGACY_SIGNIN_PREFIX)) {
      throw new Error("Use signin_user_ or signin_seller_ prefix for login OTP");
    }

    if (!validator.isEmail(normalizedEmail)) {
      throw new Error("Invalid email");
    }

    if (loginType === "user") {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        throw new Error("User not found");
      }
    }

    if (loginType === "seller") {
      const seller = await Seller.findOne({ email: normalizedEmail });
      if (!seller) {
        throw new Error("Seller not found");
      }
    }

    const existingVerificationCode= await VerificationCode.findOne({email: normalizedEmail}) ;

        if(existingVerificationCode){
      await VerificationCode.deleteOne({email: normalizedEmail});
            // console.log("Existing verification code deleted");
        }

        const otp=generateOTP();
        const verificationCode=new VerificationCode({
          email: normalizedEmail,
            otp:otp
        });
        await verificationCode.save();

        await sendVerificationEmail(
          normalizedEmail,
            "Your Login OTP for Thok Bazar",
            `Your One Time Password(OTP) for login is ${otp}. It is valid for 10 minutes.`
        );
    }

    // async createUser(req){

    // }
}
module.exports=new AuthService();