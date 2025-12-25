const HomeCategoryService = require("../service/HomeCategoryService");
const HomeSerice = require("../service/HomeSerice");


class HomeCategoryController{

    async createHomeCategories(req, res){
        try{
            const homeCategories=req.body;
            const createdCategories=await HomeCategoryService.createCategories(homeCategories);
            
            const home=await HomeSerice.createHomePageData(createdCategories);

            res.status(201).json(createdCategories);
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