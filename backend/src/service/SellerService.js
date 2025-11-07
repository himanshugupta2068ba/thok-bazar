const Address = require("../models/Address");
const Seller=require("../models/Seller.js");
const jwtprovider = require("../util/jwtprovider");

class SellerService {

   async createSeller(sellerData){
    const existingSeller=await Seller.findOne({email:sellerData.email});
    if(existingSeller){
        throw new Error("Email alrady registered")
    }
    let savedAddress=sellerData.pickupAddress;

    savedAddress=await Address.create(sellerData.pickupAddress);
    const newSeller=new Seller({
        sellerName:sellerData.sellerName,
        email:sellerData.email,
        password:sellerData.password,
        pickupAddress:savedAddress._id,
        GSTIN:sellerData.GSTIN,
        mobile:sellerData.mobile,
        bankDetails:sellerData.bankDetails,
        businessDetails:sellerData.businessDetails
    })

    return await newSeller.save();
   }

    async getSellerProfile(jwt){
        const email=jwtprovider.getEmailFromjwt(jwt);
        return this.getSellerByEmail(email);
    }
    async getSellerByEmail(email){
        const seller=await Seller.findOne({email:email})
        if(!seller){
            throw new Error("Seller Not found");
        }
        return seller;
    }

    async getSellerById(id){
    const seller=await Seller.findById(id);
    if(!seller){
        throw new Error("seller not foud")
    }
    return seller;
    }

    async updateSeller(existingSeller,sellerData){
        return await Seller.findByIdAndUpdate(existingSeller._id,sellerData,{
            new:true //return updated otherwise give oldseller
        })
    }

    async updateSellerStatus(sellerId,status){
        return await Seller.findByIdAndUpdate(sellerId,
            {$set:{accountStatus:status}},{new:true})
    }

    async deleteSeller(sellerId){
        return await Seller.findByIdAndDelete(sellerId);
    } 
}

module.exports=new SellerService();