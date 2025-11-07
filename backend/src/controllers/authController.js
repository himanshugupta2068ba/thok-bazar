const AuthService=require('../service/AuthService');

class AuthController{
    async sendloginOTP(req,res){
        try{
            const {email}=req.body;
            await AuthService.sendLoginOTP(email);
            res.status(200).json({message:"OTP sent successfully"});
        }catch(error){
            res.status(500).json({error:error.message});
        }
    }
}

module.exports=new AuthController();