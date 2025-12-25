const HomeCategorySection=require("../domain/HomeCategorySection");
const DealService = require("./DealService");

class HomeService{

    async createHomePageData(allCategories){


         const gridCategories=allCategories.filter(category=>category.section===HomeCategorySection.GRID);
         const shopByBrandCategories=allCategories.filter(category=>category.section===HomeCategorySection.SHOP_BY_BRAND);
         const electricCategories=allCategories.filter(category=>category.section===HomeCategorySection.ELECTRIC_CATEGORIES);
         const topDealsCategories=allCategories.filter(category=>category.section===HomeCategorySection.TOP_DEALS);
        //  const dealCategories=allCategories.filter(category=>category.section===HomeCategorySection.);
         const deals=await DealService.getDeals();


        const home={
            gridCategories,
            shopByBrandCategories,
            electricCategories,
            topDealsCategories,
            deals
        }
        return home;
    }
}
module.exports=new HomeService();