const AdminService = require("../service/AdminService");

const adminAuthMiddleware = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "Invalid token, authorization failed" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const admin = await AdminService.validateToken(token);
        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

module.exports = adminAuthMiddleware;
