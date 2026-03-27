const Seller=require('../models/Seller');
const VerificationCode=require('../models/VerificationCode');
const generateOTP=require('../util/generateOtp');
const sendVerificationEmail=require('../util/sendEmail.js');
const User = require('../models/user');
const createHttpError = require('../util/createHttpError');

class AuthService{
    async sendLoginOTP(email){
    const validator = require("validator");
    const SIGNIN_USER_PREFIX = "signin_user_";
    const SIGNIN_SELLER_PREFIX = "signin_seller_";
    const LEGACY_SIGNIN_PREFIX = "signin_";

    if (!email || typeof email !== "string") {
      throw createHttpError("Invalid email format", 400);
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
      throw createHttpError("Use signin_user_ or signin_seller_ prefix for login OTP", 400);
    }

    if (!validator.isEmail(normalizedEmail)) {
      throw createHttpError("Invalid email", 400);
    }

    if (loginType === "user") {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        throw createHttpError("User not found", 404);
      }
    }

    if (loginType === "seller") {
      const seller = await Seller.findOne({ email: normalizedEmail });
      if (!seller) {
        throw createHttpError("Seller not found", 404);
      }
    }

    const otp = generateOTP();

    await VerificationCode.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          otp,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    try {
      await sendVerificationEmail(
        normalizedEmail,
        "Your Login OTP for Thok Bazar",
        `Your One Time Password(OTP) for login is ${otp}. It is valid for 10 minutes.`,
      );
    } catch (error) {
      await VerificationCode.deleteOne({ email: normalizedEmail }).catch(() => undefined);
      throw error;
    }
    }

    // async createUser(req){

    // }
}
module.exports=new AuthService();
