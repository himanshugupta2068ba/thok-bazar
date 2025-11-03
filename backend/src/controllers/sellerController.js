const UserRole = require("../domain/UserRole");
const VerificationCode = require("../models/VerificationCode");
const SellerService = require("../service/SellerService");

// const 
class SellerController{
    async getSellerProfile(req,res){
        //bearer token
        try{
            const jwt=req.headers.authorization.split(" ")[1];
            const seller=await SellerService.getSellerProfile(jwt);
            res.status(200).json(seller);       
        }catch(error){
           res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }

     async createSeller(req,res){

        try{
            const seller=await SellerService.createSeller(req.body)
            res.status(200).json({message:"seller created successfully"});       
        }catch(error){
           res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }

     async getAllSeller(req,res){
        try{
           const status=req.query.status;
            const seller=await SellerService.getAllSeller(status);
            res.status(200).json(seller);       
        }catch(error){
           res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }

     async updateSeller(req,res){
        try{
            const existingSeller=await req.seller;
            const seller=await SellerService.updateSeller(existingSeller,req.body)
            res.status(200).json(seller);       
        }catch(error){
           res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }

     async deleteSeller(req,res){
        //bearer token
        try{
            const seller=await SellerService.deleteSeller(req.params.id);
            res.status(200).json({message:"deleted"});       
        }catch(error){
           res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }

     async updateSellerAccountStatus(req,res){
        try{
            const updatedSeller=await SellerService.updateSellerStatus(req.params.id,req.params.status);
            res.status(200).json(seller);       
        }catch(error){
           res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }

    async verifyLoginOtp(req,res){
        try{
            const {otp,email}=req.body;
            const seller=await SellerService.getSellerByEmail({email});

            const verificationCode=await VerificationCode.findOne({email});
            if(!verificationCode || verificationCode.otp!=otp){
                throw new Error("Invalid OTP")
            }
            const token=jwtprovider.createJwt({email});

            const authResponse={
                message:"Login Success",
                jwt:token,
                role:UserRole.SELLER
            }

            return res.status(200).json(authResponse);
        }catch(error){
            res.status(error instanceof Error? 404 : 500).json({message:error.message})
        }
    }
}