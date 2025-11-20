const jwtprovider = require("../util/jwtprovider");
const UserService = require("../service/UserService");


const authMiddleware = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: "Invalid Token, authorization failed" });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }
        let email = jwtprovider.getEmailFromjwt(token);
        const user =await UserService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({message:error.message});
    }
}

module.exports=authMiddleware;