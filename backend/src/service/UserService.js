const User = require('../models/user');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const jwtprovider = require("../util/jwtprovider");
const mongoose = require('mongoose');
const crypto = require("crypto");
const validator = require("validator");
const { hashPassword, verifyPasswordAndUpgrade } = require("../util/passwordAuth");
const { verifyGoogleIdToken } = require("../util/googleAuth");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeName = (name) => String(name || "").trim();
const normalizeMobile = (mobile) => String(mobile || "").replace(/\D/g, "").slice(-10);

const createAuthResponse = (user, message = "Signin successful") => ({
    message,
    jwt: jwtprovider.createJwt({ email: user.email, role: user.role }),
    role: user.role,
});

class UserService {
    async generatePlaceholderMobile(seedValue = "") {
        const seedDigits = String(seedValue || "").replace(/\D/g, "");

        for (let attempt = 0; attempt < 10; attempt += 1) {
            const suffixSource = `${seedDigits}${Date.now()}${attempt}`;
            const suffix = suffixSource.slice(-9).padStart(9, "0");
            const mobile = `9${suffix}`;
            const existingUser = await User.exists({ mobile });

            if (!existingUser) {
                return mobile;
            }
        }

        throw new Error("Unable to initialize customer account. Please try again.");
    }

    async createUser(req) {
        const email = normalizeEmail(req.body.email);
        const name = normalizeName(req.body.name);
        const password = String(req.body.password || "");
        const mobile = normalizeMobile(req.body.mobile);

        if (!validator.isEmail(email)) {
            throw new Error("Valid email is required");
        }

        if (!name) {
            throw new Error("Name is required");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        if (!/^\d{10}$/.test(mobile)) {
            throw new Error("Mobile must be 10 digits");
        }

        let user = await User.findOne({ email });
        if (user) {
            throw new Error("User already exists");
        }

        user = new User({
            name,
            email,
            password: await hashPassword(password),
            mobile,
        });
        await user.save();

        const cart = new Cart({ user: user._id });
        await cart.save();

        return createAuthResponse(user, "User created successfully");
    }

    async signin(req) {
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!validator.isEmail(email)) {
            throw new Error("Valid email is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await verifyPasswordAndUpgrade(user, password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        return createAuthResponse(user);
    }

    async signInWithGoogle(credential) {
        const googleProfile = await verifyGoogleIdToken(credential);
        let user = await User.findOne({ email: googleProfile.email });

        if (!user) {
            user = new User({
                name: googleProfile.name,
                email: googleProfile.email,
                password: await hashPassword(crypto.randomUUID()),
                mobile: await this.generatePlaceholderMobile(googleProfile.googleId),
            });

            await user.save();
            await new Cart({ user: user._id }).save();
        }

        return createAuthResponse(user, "Google sign-in successful");
    }

    async findUserProfile(jwt) {
        const email = jwtprovider.getEmailFromjwt(jwt);
        const user = await User.findOne({ email }).populate('address');
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async findUserByEmail(email) {
        const user = await User.findOne({ email: normalizeEmail(email) });
        if (!user) {
            throw new Error("User Not found");
        }
        return user;
    }

    async deleteUserAddress(userId, addressId) {
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            throw new Error('Invalid address id');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMapped = (user.address || []).some(
            (id) => id.toString() === addressId.toString(),
        );

        if (!isMapped) {
            throw new Error('Address does not belong to user');
        }

        await User.findByIdAndUpdate(userId, {
            $pull: { address: addressId },
        });

        await Address.findByIdAndDelete(addressId);

        return await User.findById(userId).populate('address');
    }

    async updateUserProfile(userId, values = {}) {
        const name = normalizeName(values.name);
        const email = normalizeEmail(values.email);
        const mobile = normalizeMobile(values.mobile);

        if (!name) throw new Error('Name is required');
        if (!validator.isEmail(email)) throw new Error('Valid email is required');
        if (!/^\d{10}$/.test(mobile)) throw new Error('Mobile must be 10 digits');

        const currentUser = await User.findById(userId);
        if (!currentUser) throw new Error('User not found');
        if (email !== currentUser.email) {
            throw new Error('Email changes require verification and are not available here');
        }

        const duplicate = await User.findOne({
            _id: { $ne: userId },
            mobile,
        });
        if (duplicate) throw new Error('Mobile is already in use');

        return await User.findByIdAndUpdate(
            userId,
            { name, email, mobile },
            { new: true, runValidators: true },
        ).populate('address');
    }

    async changePassword(userId, values = {}) {
        const currentPassword = String(values.currentPassword || '');
        const newPassword = String(values.newPassword || '');
        if (!currentPassword) throw new Error('Current password is required');
        if (newPassword.length < 8) throw new Error('New password must be at least 8 characters');
        if (currentPassword === newPassword) throw new Error('New password must be different');

        const user = await User.findById(userId).select('+password');
        if (!user || !(await verifyPasswordAndUpgrade(user, currentPassword))) {
            throw new Error('Current password is incorrect');
        }
        user.password = await hashPassword(newPassword);
        await user.save();
    }

    normalizeAddress(values = {}) {
        const address = {
            name: normalizeName(values.name),
            mobile: normalizeMobile(values.mobile),
            locality: String(values.locality || '').trim(),
            address: String(values.address || '').trim(),
            city: String(values.city || '').trim(),
            state: String(values.state || '').trim(),
            pincode: String(values.pincode || '').replace(/\D/g, ''),
        };
        if (!address.name || !address.address || !address.city || !address.state) {
            throw new Error('Name, street address, city, and state are required');
        }
        if (!/^\d{10}$/.test(address.mobile)) throw new Error('Mobile must be 10 digits');
        if (!/^\d{6}$/.test(address.pincode)) throw new Error('Pincode must be 6 digits');
        return address;
    }

    async createUserAddress(userId, values) {
        const address = await Address.create(this.normalizeAddress(values));
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { address: address._id } },
            { new: true },
        ).populate('address');
        if (!user) {
            await Address.findByIdAndDelete(address._id);
            throw new Error('User not found');
        }
        return user;
    }

    async updateUserAddress(userId, addressId, values) {
        if (!mongoose.Types.ObjectId.isValid(addressId)) throw new Error('Invalid address id');
        const user = await User.findOne({ _id: userId, address: addressId });
        if (!user) throw new Error('Address does not belong to user');
        await Address.findByIdAndUpdate(addressId, this.normalizeAddress(values), {
            runValidators: true,
        });
        return await User.findById(userId).populate('address');
    }
}

module.exports = new UserService();
