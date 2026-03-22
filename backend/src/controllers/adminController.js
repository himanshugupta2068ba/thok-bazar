const AdminService = require("../service/AdminService");

class AdminController {
    async login(req, res) {
        try {
            const result = await AdminService.login(req.body || {});
            return res.status(200).json(result);
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }

    async getSession(req, res) {
        return res.status(200).json({ admin: req.admin });
    }

    async getAccount(req, res) {
        try {
            const admin = await AdminService.getAccount();
            return res.status(200).json({ admin });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateAccount(req, res) {
        try {
            const result = await AdminService.updateAccount(req.body || {});
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();
