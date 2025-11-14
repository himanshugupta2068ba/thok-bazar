
const calculateDiscountPercentage = require('../utils/discountCalculator');
class ProductService{
   async createProduct(req,seller){
        // Logic to create a new product
        try{
            const discountPercentage = calculateDiscountPercentage(req.body.mrpPrice, req.body.sellingPrice);
            const category1 = await this.createOrGetCategory(req.body.categoryId, 1);
            const category2 = await this.createOrGetCategory(req.body.subCategoryId, 2, category1._id);
            const category3 = await this.createOrGetCategory(req.body.subSubCategoryId, 3, category2._id);
            const product = new Product({
                title: req.body.title,
                description: req.body.description,
                mrpPrice: req.body.mrpPrice,
                sellingPrice: req.body.sellingPrice,
                category: category3._id,
                stock: req.body.stock,
                images: req.body.images,
                sellerId: seller._id,
                discountPercentage: discountPercentage,
                color: req.body.color,
                size: req.body.size
            });
            await product.save();
            return product;

        }catch(error){
            throw new Error('Error creating product: ' + error.message);
        }
    }
    async createOrGetCategory(categoryId,level,parentId=null){
        // Logic to create or get category
        let category=await Category.findOne({categoryId:categoryId});
        if(!category){
            category=new Category({
                categoryId:categoryId,
                parentCategory:parentId,
                level:level
            });
            category=await category.save();
        }
        return category;
    }

    async deleteProduct(productId,seller){
        // Logic to delete a product
        const product=await Product.findOne({_id:productId,sellerId:seller._id});
        if(!product){
            throw new Error('Product not found or you do not have permission to delete this product');
        }
        await Product.deleteOne({_id:productId});
        return true;
    }
    
}