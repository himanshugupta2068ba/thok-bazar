const jwt=require("jsonwebtoken")

const seceretkey="kingisheretorulenottoexist"


class JwtProvider{

    constructor(seceretkey){
       this.seceretkey=seceretkey;
    }

    createJwt(payload){
      return jwt.sign(payload,this.seceretkey,{expiresIn:"24h"})
    }
    getEmailFromjwt(token){
        try{
            const decodeToken=jwt.verify(token,this.seceretkey)
            return decodeToken.email;
        }
        catch(err){
            throw new Error("Invalid Token")
        }
    }
    verifyJwt(token){
        try{
            return jwt.verify(token,this.seceretkey)
        }
        catch(err){
            throw new Error("Invalid Token")
        }
    }

}
module.exports=new JwtProvider(seceretkey);


