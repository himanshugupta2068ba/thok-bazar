const User = require('../models/user');
const Address = require('../models/Address');
const bycrypt = require('bcrypt');
const Cart = require('../models/Cart');
const jwtprovider = require("../util/jwtprovider");
const VerificationCode = require('../models/VerificationCode');
const mongoose = require('mongoose');

class UserService{
    async createUser(req){
        const {email,name}=req.body;


        // Additional logic for creating a user can be added here
        let  user=await User.findOne({email:email});
        if(user){
            throw new Error("User already exists");
        }


       const verificationCode=await VerificationCode.findOne({email});
       if(!verificationCode || verificationCode.otp!=req.body.otp){
        throw new Error("Invalid OTP")
       }

        user=new User({
            name:name,
            email:email,
            password:await bycrypt.hash(req.body.password,10),
            mobile:req.body.mobile
        });
        await user.save();

        const cart=new Cart({user:user._id});
        await cart.save();

        return jwtprovider.createJwt({email});
    }

    async signin(req){
        const {email,password,otp}=req.body;
    
        const user = await User.findOne({email});
        if(!user){
            throw new Error("User not found");
        }
        // const isPasswordValid=await bycrypt.compare(password,user.password);
         const verificationCode=await VerificationCode.findOne({email});

         if(!verificationCode || verificationCode.otp!=otp){
            throw new Error("Invalid OTP")
        }
        return {
            message:"Signin successful",
            jwt:jwtprovider.createJwt({email}),
            role:user.role
        }
    }

    async findUserProfile(jwt){
        const email=jwtprovider.getEmailFromjwt(jwt);
        const user=await User.findOne({email}).populate('address');
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }

    async findUserByEmail(email){
        const user=await User.findOne({email:email});
        if(!user){
            throw new Error("User Not found");
        }
        return user;
    }

    async deleteUserAddress(userId, addressId) {
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            throw new Error('Invalid address id');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMapped = (user.address || []).some(
            (id) => id.toString() === addressId.toString(),
        );

        if (!isMapped) {
            throw new Error('Address does not belong to user');
        }

        await User.findByIdAndUpdate(userId, {
            $pull: { address: addressId },
        });

        await Address.findByIdAndDelete(addressId);

        return await User.findById(userId).populate('address');
    }
}

module.exports=new UserService();