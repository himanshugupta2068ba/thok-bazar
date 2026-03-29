const AuthService = require('../service/AuthService');
const UserService = require('../service/UserService');
const { getRequestContext, logError } = require('../util/requestTrace');

const getStatusCode = (error) => Number(error?.statusCode) || 500;

class UserController {
    constructor() {
        this.sendLoginOtp = this.sendLoginOtp.bind(this);
        this.createUser = this.createUser.bind(this);
        this.signin = this.signin.bind(this);
        this.googleSignin = this.googleSignin.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
        this.deleteUserAddress = this.deleteUserAddress.bind(this);
        this.findUserByEmail = this.findUserByEmail.bind(this);
    }

    async sendLoginOtp(req, res) {
        const requestContext = getRequestContext(req, {
            authFlow: 'customer-login-otp',
        });

        try {
            const { email } = req.body;
            await AuthService.sendLoginOTP(email, requestContext);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            logError('Customer login OTP request failed', error, requestContext);
            res.status(getStatusCode(error)).json({ error: error.message || "Failed to send OTP" });
        }
    }

    async createUser(req, res) {
        try {
            const result = await UserService.createUser(req);
            res.status(200).json(result);
        }
        catch (error) {
            this.handelErrors(error, res);
        }
    }

    async signin(req, res) {
        try {
            const result = await UserService.signin(req);
            res.status(200).json(result);
        } catch (error) {
            this.handelErrors(error, res);
        }
    }

    async googleSignin(req, res) {
        try {
            const { credential } = req.body || {};
            const result = await UserService.signInWithGoogle(credential);
            res.status(200).json(result);
        } catch (error) {
            this.handelErrors(error, res);
        }
    }

    async getUserProfile(req, res) {
        try {
            const jwt = req.headers.authorization.split(" ")[1];
            const user = await UserService.findUserProfile(jwt);
            res.status(200).json(user);
        } catch (error) {
            this.handelErrors(error,res);
        }
    }

    async deleteUserAddress(req, res) {
        try {
            const user = req.user;
            const { addressId } = req.params;
            const updatedUser = await UserService.deleteUserAddress(user._id, addressId);
            res.status(200).json(updatedUser);
        } catch (error) {
            this.handelErrors(error, res);
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
            return;
        }
        return res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports = new UserController();
