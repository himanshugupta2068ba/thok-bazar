const UserRole = require('../domain/UserRole');
const AuthService = require('../service/AuthService');
const UserService = require('../service/UserService');

class UserController {
    async sendLoginOtp(req, res) {
        try {
            const { email } = req.body;
            await AuthService.sendLoginOTP(email);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const jwt = await UserService.createUser(req);
            res.status(200).json({ message: "User created successfully", jwt,role:UserRole.CUSTOMER });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async signin(req, res) {
        try {
            const result = await UserService.signin(req);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserProfile(req, res) {
        try {
            const jwt = req.headers.authorization.split(" ")[1];
            const user = await UserService.findUserProfile(jwt);
            res.status(200).json(user);
        } catch (error) {
            // res.status(500).json({ error: error.message });
            this.handelErrors(error,res);
        }
    }

   async findUserByEmail(req, res) {
        try {
            const email = req.params.email;
            const user = await UserService.findUserByEmail(email);
            res.status(200).json(user);
        }
        catch (error) {
            this.handelErrors(error,res);
        }
    }

    async handelErrors(err,res){
        if(err instanceof Error){
            res.status(400).json({message:err.message});
        }
        return res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports = new UserController();