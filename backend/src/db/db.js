const mongoose=require("mongoose");

const url="mongodb+srv://himanshuguptadeveloper_db_user:S5xdXBXZVPtprypO@cluster0.fqvwr7t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb=async()=>{
    try{
        const conn=await mongoose.connect(url)
        console.log('MongoDB connected:',conn.connection.host);
    }
    catch(err){
        console.log(err);
    }
}
module.exports=connectDb;