const Address = require("../models/Address");
const Seller = require("../models/Seller.js");
const jwtprovider = require("../util/jwtprovider");
const validator = require("validator");
const UserRole = require("../domain/UserRole");
const { hashPassword, verifyPasswordAndUpgrade } = require("../util/passwordAuth");
const { verifyGoogleIdToken } = require("../util/googleAuth");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeMobile = (mobile) => String(mobile || "").replace(/\D/g, "").slice(-10);
const createSellerAuthResponse = (seller, message = "Login Success") => ({
    message,
    jwt: jwtprovider.createJwt({ email: seller.email, role: seller.role || UserRole.SELLER }),
    role: UserRole.SELLER,
});

class SellerService {
    async createSeller(sellerData) {
        const email = normalizeEmail(sellerData.email);
        const password = String(sellerData.password || "");
        const mobile = normalizeMobile(sellerData.mobile);

        if (!validator.isEmail(email)) {
            throw new Error("Valid email is required");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        if (!/^\d{10}$/.test(mobile)) {
            throw new Error("Mobile must be 10 digits");
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            throw new Error("Email already registered");
        }
        let savedAddress = sellerData.pickupAddress;

        savedAddress = await Address.create(sellerData.pickupAddress);
        const newSeller = new Seller({
            sellerName: sellerData.sellerName,
            email,
            password: await hashPassword(password),
            pickupAddress: savedAddress._id,
            GSTIN: sellerData.GSTIN,
            mobile,
            bankDetails: sellerData.bankDetails,
            businessDetails: sellerData.businessDetails,
        });

        return await newSeller.save();
    }

    async getAllSeller(status) {
        const query = {};
        if (status) {
            query.accountStatus = status;
        }
        return await Seller.find(query).sort({ createdAt: -1 });
    }

    async getSellerProfile(jwt) {
        const email = jwtprovider.getEmailFromjwt(jwt);
        return this.getSellerByEmail(email);
    }

    async getSellerByEmail(email) {
        const seller = await Seller.findOne({ email: normalizeEmail(email) }).populate("pickupAddress");
        if (!seller) {
            throw new Error("Seller Not found");
        }
        return seller;
    }

    async getSellerById(id) {
        const seller = await Seller.findById(id);
        if (!seller) {
            throw new Error("seller not foud");
        }
        return seller;
    }

    async updateSeller(existingSeller, sellerData) {
        return await Seller.findByIdAndUpdate(
            existingSeller._id,
            { $set: sellerData },
            {
                new: true,
                runValidators: false,
            }
        );
    }

    async updateSellerStatus(sellerId, status) {
        return await Seller.findByIdAndUpdate(sellerId, { $set: { accountStatus: status } }, { new: true });
    }

    async deleteSeller(sellerId) {
        return await Seller.findByIdAndDelete(sellerId);
    }

    async signin({ email, password }) {
        const normalizedEmail = normalizeEmail(email);
        const normalizedPassword = String(password || "");

        if (!validator.isEmail(normalizedEmail)) {
            throw new Error("Valid email is required");
        }

        if (!normalizedPassword) {
            throw new Error("Password is required");
        }

        const seller = await Seller.findOne({ email: normalizedEmail }).select("+password");

        if (!seller) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await verifyPasswordAndUpgrade(seller, normalizedPassword);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        return createSellerAuthResponse(seller);
    }

    async signInWithGoogle(credential) {
        const googleProfile = await verifyGoogleIdToken(credential);
        const seller = await Seller.findOne({ email: googleProfile.email });

        if (!seller) {
            throw new Error("No seller account found for this Google email. Create a seller account first.");
        }

        return createSellerAuthResponse(seller, "Google sign-in successful");
    }
}

module.exports = new SellerService();
