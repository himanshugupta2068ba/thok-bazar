const Seller=require('../models/Seller');
const VerificationCode=require('../models/VerificationCode');
const generateOTP=require('../util/generateOtp');
const sendVerificationEmail=require('../util/sendEmail.js');
const User = require('../models/user');
const createHttpError = require('../util/createHttpError');
const { logError, logInfo, logWarn, maskEmail } = require('../util/requestTrace');

class AuthService{
    async sendLoginOTP(email, requestContext = {}){
    const validator = require("validator");
    const SIGNIN_USER_PREFIX = "signin_user_";
    const SIGNIN_SELLER_PREFIX = "signin_seller_";
    const LEGACY_SIGNIN_PREFIX = "signin_";

    logInfo("OTP send requested", {
      ...requestContext,
      email: maskEmail(email),
    });

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

    logInfo("OTP request normalized", {
      ...requestContext,
      email: maskEmail(normalizedEmail),
      loginType: loginType || "generic",
    });

    if (loginType === "user") {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        logWarn("OTP request rejected because customer was not found", {
          ...requestContext,
          email: maskEmail(normalizedEmail),
          loginType,
        });
        throw createHttpError("User not found", 404);
      }
    }

    if (loginType === "seller") {
      const seller = await Seller.findOne({ email: normalizedEmail });
      if (!seller) {
        logWarn("OTP request rejected because seller was not found", {
          ...requestContext,
          email: maskEmail(normalizedEmail),
          loginType,
        });
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

    logInfo("OTP code persisted", {
      ...requestContext,
      email: maskEmail(normalizedEmail),
      loginType: loginType || "generic",
    });

    try {
      await sendVerificationEmail(
        normalizedEmail,
        "Your Login OTP for Thok Bazar",
        `Your One Time Password(OTP) for login is ${otp}. It is valid for 10 minutes.`,
        {
          ...requestContext,
          email: maskEmail(normalizedEmail),
          loginType: loginType || "generic",
        },
      );

      logInfo("OTP email dispatched successfully", {
        ...requestContext,
        email: maskEmail(normalizedEmail),
        loginType: loginType || "generic",
      });
    } catch (error) {
      await VerificationCode.deleteOne({ email: normalizedEmail }).catch(() => undefined);
      logError("OTP email dispatch failed and OTP record was rolled back", error, {
        ...requestContext,
        email: maskEmail(normalizedEmail),
        loginType: loginType || "generic",
      });
      throw error;
    }
    }

    // async createUser(req){

    // }
}
module.exports=new AuthService();
