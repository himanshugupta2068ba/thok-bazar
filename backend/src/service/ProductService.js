const Product = require('../models/Product');
const Category = require('../models/Category');
const calculateDiscountPercentage = require('../util/discountCalculator');
class ProductService{

      async createOrGetCategory(categoryId, level, parentId = null) {
    let category = await Category.findOne({ categoryId });

    if (!category) {
        category = new Category({
            name: categoryId,        // 🔥 Required fix
            categoryId: categoryId,
            parentCategory: parentId,
            level: level
        });

        category = await category.save();
    }

    return category;
}


   async createProduct(req,seller){
        // Logic to create a new product
        try{
           console.log(seller);
            const discountPercentage = calculateDiscountPercentage(req.body.mrpPrice, req.body.sellingPrice);
            const category1 = await this.createOrGetCategory(req.body.categoryId, 1);
           
            const category2 = await this.createOrGetCategory(req.body.subCategoryId, 2, category1._id);
            const category3 = await this.createOrGetCategory(req.body.subSubCategoryId, 3, category2._id);
            // console.log("Categories created/retrieved:", category1, category2, category3);
            // console.log(req.body);
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
            // console.log("Product to be saved:", product);
            await product.save();
            return product;

        }catch(error){
            throw new Error('Error creating product: ' + error.message);
        }
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
    
    async updateProduct(productId,updateProductData){

        try{
            const product=await Product.findByIdAndUpdate(productId,updateProductData,{new:true});
            if(!product){
                throw new Error('Product not found');
            }
            return product;
        }catch(error){
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async findProductbyId(productId){
        const product=await Product
        .findById(productId)
        .populate('category')
        .populate('sellerId','name email');
        if(!product){
            throw new Error('Product not found');
        }
        return product;
    }

    async searchProducts(query){
        try{
            const products=await Product.find({title:{$regex:query,$options:'i'}});
            return products;
        }catch(error){
            throw new Error('Error searching products: ' + error.message);
        }
    }

    async getProductBySeller(sellerId){
        return await Product.find({sellerId:sellerId});
    }

    async getAllProducts(req){
        const filterQuery={};
 
        if(req.category){
            const category=await Category.findOne({categoryId:req.category});

            if(!category){
                return{
                    content:[],
                    totalpages:0,
                    totalElement:0
                }
            }
            filterQuery.category=category._id.toString();
        }

        if(req.color){
            filterQuery.color=req.color;
        }

        if(req.minPrice && req.maxPrice){
            filterQuery.sellingPrice={$gte:req.minPrice,$lte:req.maxPrice};
        }

        if(req.minDiscount){
            filterQuery.discountPercentage={$gte:req.minDiscount};
        }
        if(req.size){
            filterQuery.size=req.size;
        }
        let sortQuery={};
        if(req.sort=="price_low"){
            sortQuery.sellingPrice=1;
        }else if(req.sort=="price_high"){
            sortQuery.sellingPrice=1;
        }

        const product=await Product.find(filterQuery)
        .sort(sortQuery)
        .skip((req.pageNumber)*10)
        .limit(10);

        const totalElement=await Product.countDocuments(filterQuery);
        const totalpages=Math.ceil(totalElement/10);

        const response={
            content:product,
            totalpages:totalpages,
            totalElement:totalElement
        };

        return response;

    }
}
const productService=new ProductService();
module.exports=productService;