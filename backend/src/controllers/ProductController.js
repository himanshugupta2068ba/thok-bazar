const Product=require('../models/Product');
const Category=require('../models/Category');
const ProductService=require('../service/ProductService');
// const {createProductSchema,updateProductSchema}=require('../validations/productValidation');
// const Yup=require('yup');

class SellerProductController{

    async getProductBySellerId(req,res){
        try{
            const seller=req.user;
            const productService=new ProductService();
            const pageNumber = req.query.pageNumber ?? req.query.page ?? 0;
            const products=await productService.getProductsBySellerId(seller._id,pageNumber);
            res.status(200).json(products);
        }catch(error){
            res.status(500).json({message:'Error fetching products: '+error.message});
        }
    }

    async createProduct(req,res){
        try{
            // await createProductSchema.validate(req.body);
            const seller=req.user;
            console.log(seller);
            const productService=new ProductService();
            const product=await productService.createProduct(req,seller);
            res.status(201).json(product);
        }catch(error){
            res.status(500).json({message:'Error creating product: '+error.message});
        }
    }
    async deleteProduct(req,res){
        try{
            const seller=req.user;
            const productService=new ProductService();
            await productService.deleteProduct(req.params.productId,seller);
            res.status(200).json({message:'Product deleted successfully'});
        }catch(error){
            res.status(500).json({message:'Error deleting product: '+error.message});
        }
    }
    async updateProduct(req,res){
        try{
            // await updateProductSchema.validate(req.body);
            const productService=new ProductService();
            const product=await productService.updateProduct(req.params.productId,req.body);
            res.status(200).json(product);
        }catch(error){
            res.status(500).json({message:'Error updating product: '+error.message});
        }

    }

    async getProductById(req,res){
        try{
            const productService=new ProductService();
            const product=await productService.findProductbyId(req.params.productId);
            res.status(200).json(product);
        }catch(error){
            res.status(500).json({message:'Error fetching product: '+error.message});
        }
    }
    async searchProducts(req,res){
        try{
            const productService=new ProductService();
            const products=await productService.searchProducts(req.query.q);
            res.status(200).json(products);
        }catch(error){
            res.status(500).json({message:'Error searching products: '+error.message});
        }
    }
  async getAllProducts(req,res){
        try{
            const productService=new ProductService();
            const products=await productService.getAllProducts(req.query);
            res.status(200).json(products);
        }catch(error){
            res.status(500).json({message:'Error fetching products: '+error.message});
        }
    }

}
module.exports=new SellerProductController();