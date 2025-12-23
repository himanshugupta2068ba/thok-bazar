const moongoose=require('mongoose');
const HomeCategegorySection=require('../domain/HomeCategorySection');

const homeCategorySchema=moongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    categoryId:{
        type:String,
        required:true
    },
    section:{
        type:String,
        enum:Object.values(HomeCategegorySection),
        required:true
    }
},{timestamps:true});

const HomeCategory=moongoose.model('HomeCategory',homeCategorySchema);
module.exports=HomeCategory;