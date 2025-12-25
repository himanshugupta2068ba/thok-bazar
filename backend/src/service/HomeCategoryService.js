const HomeCategory = require("../models/HomeCategory");

class HomeCategoryService {

    async getAllHomeCategories() {
        try {
            return await HomeCategory.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error("Failed to fetch home categories");
        }
    }

    async createHomeCategory(homeCategory) {
        if (!homeCategory?.name || !homeCategory?.image || !homeCategory?.categoryId) {
            throw new Error("Missing required home category fields");
        }

        try {
            return await HomeCategory.create(homeCategory);
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Home category already exists");
            }
            throw new Error("Failed to create home category");
        }
    }

    async createCategories(homeCategories) {
        const existingCategories = await HomeCategory.find();
        if (existingCategories.length==0){
            return await HomeCategory.insertMany(homeCategories);
        }
        return existingCategories;
    }

    async updateHomeCategory(id, homeCategory) {
        const existingCategory = await HomeCategory.findById(id);
        if (!existingCategory) {
            throw new Error("Home category not found");
        }
        return await HomeCategory.findByIdAndUpdate(
            id,
            { $set: homeCategory },
            { new: true }
        );
    }

}

module.exports = new HomeCategoryService();
