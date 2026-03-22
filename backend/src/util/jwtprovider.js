const jwt=require("jsonwebtoken")

const seceretkey="kingisheretorulenottoexist"


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
module.exports=new JwtProvider(seceretkey);


