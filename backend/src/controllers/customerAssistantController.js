const CustomerAssistantService = require("../service/CustomerAssistantService");
const jwtprovider = require("../util/jwtprovider");
const UserRole = require("../domain/UserRole");
const UserService = require("../service/UserService");

class CustomerAssistantController {
    constructor() {
        this.resolveCustomer = this.resolveCustomer.bind(this);
        this.reply = this.reply.bind(this);
    }

    async resolveCustomer(req) {
        try {
            const authHeader = req.headers.authorization || "";

            if (!authHeader.startsWith("Bearer ")) {
                return null;
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                return null;
            }

            const payload = jwtprovider.verifyJwt(token);

            if (payload?.role !== UserRole.CUSTOMER) {
                return null;
            }

            return await UserService.findUserByEmail(payload.email);
        } catch (error) {
            return null;
        }
    }

    async reply(req, res) {
        try {
            const customer = await this.resolveCustomer(req);
            const result = await CustomerAssistantService.generateResponse({
                message: req.body?.message,
                conversation: req.body?.conversation || [],
                customer,
            });

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message || "Unable to generate customer assistant response",
            });
        }
    }
}

module.exports = new CustomerAssistantController();
