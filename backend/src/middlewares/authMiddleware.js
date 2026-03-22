const jwtprovider = require("../util/jwtprovider");
const UserService = require("../service/UserService");
const UserRole = require("../domain/UserRole");


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
        const payload = jwtprovider.verifyJwt(token);
        if (payload.role !== UserRole.CUSTOMER && payload.role !== UserRole.ADMIN) {
            return res.status(401).json({ message: "Unauthorized role" });
        }
        let email = payload.email;
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
