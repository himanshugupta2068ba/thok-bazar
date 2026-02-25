const Deal = require("../models/Deal");
const HomeCategory = require("../models/HomeCategory");

class DealService {

    async getDeals(){
        return await Deal.find().populate({path:'category'});
    }

    async createDeal(deal){
        try{
            const category=await HomeCategory.findById(deal.categoryId);
            if(!category){
                throw new Error('Invalid Home Category');
            }

            const newDeal=new Deal({
                ...deal,
                category:category._id
            });
            const savedDeal=await newDeal.save();
            return await Deal.findById(savedDeal._id).populate({path:'category'});
        }catch(err){
            throw new Error(err.message);
        }
    }

    async updateDeal(deal,id){
        const existingDeal=await Deal.findById(id).populate({path:'category'});
        if(existingDeal){
            return await Deal.findByIdAndUpdate(existingDeal._id,
                {discount:deal.discount},
                {new:true}
            ).populate({path:'category'});
        }
        throw new Error('Deal not found');
    }

    async deleteDeal(id){
        const deal=await Deal.findById(id);
        if(!deal){
            throw new Error('Deal not found');
        }
        return await Deal.findByIdAndDelete(id);
    }
}

module.exports=new DealService();