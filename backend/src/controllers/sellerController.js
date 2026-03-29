const UserRole = require("../domain/UserRole");
const VerificationCode = require("../models/VerificationCode");
const SellerService = require("../service/SellerService");
const jwtprovider = require("../util/jwtprovider");
const AuthService = require("../service/AuthService");
const { getRequestContext, logError } = require("../util/requestTrace");

const getStatusCode = (error) => Number(error?.statusCode) || 500;

class SellerController {
    async getSellerProfile(req, res) {
        try {
            const jwt = req.headers.authorization.split(" ")[1];
            const seller = await SellerService.getSellerProfile(jwt);
            res.status(200).json(seller);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async createSeller(req, res) {
        try {
            await SellerService.createSeller(req.body);
            res.status(200).json({ message: "seller created successfully" });
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async getAllSeller(req, res) {
        try {
            const status = req.query.status;
            const seller = await SellerService.getAllSeller(status);
            res.status(200).json(seller);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async updateSeller(req, res) {
        try {
            const existingSeller = await req.user;
            const seller = await SellerService.updateSeller(existingSeller, req.body);
            res.status(200).json(seller);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async deleteSeller(req, res) {
        try {
            await SellerService.deleteSeller(req.params.id);
            res.status(200).json({ message: "deleted" });
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async updateSellerAccountStatus(req, res) {
        try {
            const updatedSeller = await SellerService.updateSellerStatus(req.params.id, req.params.status);
            res.status(200).json(updatedSeller);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async verifyLoginOtp(req, res) {
        try {
            const { otp, email } = req.body;
            const seller = await SellerService.getSellerByEmail(email);
            const verificationCode = await VerificationCode.findOne({ email });
            if (!verificationCode || verificationCode.otp != otp) {
                throw new Error("Invalid OTP");
            }
            const token = jwtprovider.createJwt({ email, role: seller.role });

            const authResponse = {
                message: "Login Success",
                jwt: token,
                role: UserRole.SELLER,
            };

            return res.status(200).json(authResponse);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
        }
    }

    async sendLoginOtp(req, res) {
        const requestContext = getRequestContext(req, {
            authFlow: "seller-login-otp",
        });

        try {
            const { email } = req.body;
            await AuthService.sendLoginOTP(email, requestContext);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            logError("Seller login OTP request failed", error, requestContext);
            res.status(getStatusCode(error)).json({ error: error.message || "Failed to send OTP" });
        }
    }

    async signin(req, res) {
        try {
            const result = await SellerService.signin(req.body || {});
            return res.status(200).json(result);
        } catch (error) {
            return res.status(error instanceof Error ? 400 : 500).json({
                message: error?.message || "Seller login failed",
            });
        }
    }

    async googleSignin(req, res) {
        try {
            const { credential } = req.body || {};
            const result = await SellerService.signInWithGoogle(credential);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(error instanceof Error ? 400 : 500).json({
                message: error?.message || "Google sign-in failed",
            });
        }
    }
}

module.exports = new SellerController();
