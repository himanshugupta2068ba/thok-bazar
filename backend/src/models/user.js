const mongoose=require('mongoose');
const UserRole = require('../domain/UserRole');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },  
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    address:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    }
],
    role:{
        type:String,
        enum:[UserRole.CUSTOMER,UserRole.ADMIN],
        default:UserRole.CUSTOMER
    }
});

const User=mongoose.model('User',userSchema);

module.exports=User;