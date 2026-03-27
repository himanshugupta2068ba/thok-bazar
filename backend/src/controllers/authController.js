const AuthService=require('../service/AuthService');

const getStatusCode = (error) => Number(error?.statusCode) || 500;

class AuthController{
    async sendloginOTP(req,res){
        try{
            const {email}=req.body;
            await AuthService.sendLoginOTP(email);
            res.status(200).json({message:"OTP sent successfully"});
        }catch(error){
            res.status(getStatusCode(error)).json({error:error.message || "Failed to send OTP"});
        }
    }
}

module.exports=new AuthController();
