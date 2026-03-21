const Deal = require("../models/Deal");
const HomeCategory = require("../models/HomeCategory");
const Product = require("../models/Product");
const mongoose = require("mongoose");

class DealService {

    async resolveDealCategory(categoryInput) {
        const rawValue = String(categoryInput || "").trim();
        if (!rawValue) {
            throw new Error("Category is required");
        }

        if (mongoose.Types.ObjectId.isValid(rawValue)) {
            const categoryById = await HomeCategory.findById(rawValue);
            if (categoryById) {
                return categoryById;
            }
        }

        const categoryByKey = await HomeCategory.findOne({
            categoryId: rawValue,
            section: "TOP_DEALS",
        });

        if (categoryByKey) {
            return categoryByKey;
        }

        throw new Error("Invalid deal category. Create category image/details in TOP_DEALS first.");
    }

    normalizeObjectIdArray(values = []) {
        if (!Array.isArray(values)) {
            return [];
        }

        return values
            .map((id) => String(id || "").trim())
            .filter(Boolean);
    }

    buildCategoryProductQuery(category) {
        const categoryId = String(category?.categoryId || "").trim();
        if (!categoryId) {
            return null;
        }

        return {
            $or: [
                { mainCategory: categoryId },
                { subCategory: categoryId },
                { subSubCategory: categoryId },
            ],
        };
    }

    async buildDealPresentation(dealDocument) {
        const deal = dealDocument?.toObject ? dealDocument.toObject() : dealDocument;
        const productIds = this.normalizeObjectIdArray(deal?.productIds || []);
        const productQuery = productIds.length
            ? { _id: { $in: productIds } }
            : this.buildCategoryProductQuery(deal?.category);

        let representativeProduct = null;
        let appliedProductCount = 0;

        if (productQuery) {
            representativeProduct = await Product.findOne(productQuery)
                .select("title images sellingPrice mrpPrice mainCategory subCategory subSubCategory")
                .sort({ createdAt: -1 })
                .lean();

            appliedProductCount = await Product.countDocuments(productQuery);
        }

        return {
            ...deal,
            displayName: representativeProduct?.title || deal?.category?.name || "Deal",
            displayImage:
                representativeProduct?.images?.[0] ||
                deal?.category?.image ||
                "https://via.placeholder.com/300x300?text=Deal",
            appliedProductCount,
            representativeProduct,
        };
    }

    async getDeals(options = {}){
        const { activeOnly = false } = options;
        const query = activeOnly
            ? { $or: [{ isActive: true }, { isActive: { $exists: false } }] }
            : {};

        const deals = await Deal.find(query)
            .populate({path:'category'})
            .sort({ createdAt: -1 });

        return await Promise.all(deals.map((deal) => this.buildDealPresentation(deal)));
    }

    async createDeal(deal){
        try{
            const category = await this.resolveDealCategory(deal.categoryId);

            const normalizedProductIds = this.normalizeObjectIdArray(deal.productIds);

            const newDeal=new Deal({
                discount: Number(deal.discount),
                category:category._id,
                productIds: normalizedProductIds,
                isActive: deal.isActive !== undefined ? Boolean(deal.isActive) : true,
            });
            const savedDeal=await newDeal.save();
            const createdDeal = await Deal.findById(savedDeal._id).populate({path:'category'});
            return await this.buildDealPresentation(createdDeal);
        }catch(err){
            throw new Error(err.message);
        }
    }

    async updateDeal(deal,id){
        const existingDeal=await Deal.findById(id);
        if(existingDeal){
            const updatePayload = {};

            if (deal.discount !== undefined) {
                updatePayload.discount = Number(deal.discount);
            }

            if (deal.isActive !== undefined) {
                updatePayload.isActive = Boolean(deal.isActive);
            }

            if (deal.productIds !== undefined) {
                updatePayload.productIds = this.normalizeObjectIdArray(deal.productIds);
            }

            if (deal.categoryId) {
                const category = await this.resolveDealCategory(deal.categoryId);
                updatePayload.category = category._id;
            }

            const updatedDeal = await Deal.findByIdAndUpdate(
                existingDeal._id,
                updatePayload,
                {new:true}
            ).populate({path:'category'});

            return await this.buildDealPresentation(updatedDeal);
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