const AuthService=require('../service/AuthService');
const { getRequestContext, logError } = require('../util/requestTrace');

const getStatusCode = (error) => Number(error?.statusCode) || 500;

class AuthController{
    async sendloginOTP(req,res){
        const requestContext = getRequestContext(req, {
            authFlow: 'customer-login-otp',
        });

        try{
            const {email}=req.body;
            await AuthService.sendLoginOTP(email, requestContext);
            res.status(200).json({message:"OTP sent successfully"});
        }catch(error){
            logError('Customer login OTP request failed', error, requestContext);
            res.status(getStatusCode(error)).json({error:error.message || "Failed to send OTP"});
        }
    }
}

module.exports=new AuthController();
