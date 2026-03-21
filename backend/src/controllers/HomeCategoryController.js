const HomeCategoryService = require("../service/HomeCategoryService");
const HomeSerice = require("../service/HomeSerice");


class HomeCategoryController{

    async createHomeCategories(req, res){
        try{
            const homeCategories=req.body;

            // Keep backward compatibility for existing bulk-seed payloads.
            if (Array.isArray(homeCategories)) {
                const createdCategories=await HomeCategoryService.createCategories(homeCategories);
                await HomeSerice.createHomePageData(createdCategories);
                return res.status(201).json(createdCategories);
            }

            // Admin create flow: create one category item directly.
            const createdCategory = await HomeCategoryService.createHomeCategory(homeCategories);
            return res.status(201).json(createdCategory);
        }catch(err){
            res.status(500).json({error:err.message});
        }
    }

    async getAllHomeCategories(req, res){
        try{
            const homeCategories=await HomeCategoryService.getAllHomeCategories();
            res.status(200).json(homeCategories);
        }catch(err){
            res.status(500).json({error:err.message});
        }
    }

    async updateHomeCategory(req, res){
        try{
            const id=req.params.id;
            const homeCategory=req.body;
            const updatedCategory=await HomeCategoryService.updateHomeCategory(id,homeCategory);
            res.status(200).json(updatedCategory);
        }catch(err){
            res.status(500).json({error:err.message});
        }
    }


}
module.exports=new HomeCategoryController();