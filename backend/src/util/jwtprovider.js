const jwt=require("jsonwebtoken")

const resolveSecretKey = () => {
    const configuredSecret = String(process.env.JWT_SECRET || "").trim();

    if (configuredSecret) {
        return configuredSecret;
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET is not configured");
    }

    return "development-only-jwt-secret";
};


class JwtProvider{

    constructor(seceretkey){
       this.seceretkey=seceretkey;
    }

    createJwt(payload){
      return jwt.sign(payload,this.seceretkey,{expiresIn:"24h"})
    }
    getPayloadFromjwt(token){
        try{
            return jwt.verify(token,this.seceretkey)
        }
        catch(err){
            throw new Error("Invalid Token")
        }
    }
    getEmailFromjwt(token){
        const decodeToken=this.getPayloadFromjwt(token);
        return decodeToken.email;
    }
    verifyJwt(token){
        return this.getPayloadFromjwt(token)
    }

}
module.exports=new JwtProvider(resolveSecretKey());


