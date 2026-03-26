const bcrypt = require("bcrypt");
const AdminCredential = require("../models/AdminCredential");
const jwtprovider = require("../util/jwtprovider");
const UserRole = require("../domain/UserRole");

class AdminService {
    normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    getConfiguredAdminEmail() {
        const email = this.normalizeEmail(process.env.ADMIN_EMAIL);

        if (!email) {
            throw new Error("ADMIN_EMAIL is not configured");
        }

        return email;
    }

    getConfiguredAdminPassword() {
        const password = String(process.env.ADMIN_PASSWORD || "");

        if (!password) {
            throw new Error("ADMIN_PASSWORD is not configured");
        }

        return password;
    }

    async getOrCreateAdminCredential() {
        let credential = await AdminCredential.findOne().sort({ createdAt: 1 });

        if (credential) {
            return credential;
        }

        const passwordHash = await bcrypt.hash(this.getConfiguredAdminPassword(), 10);

        credential = await AdminCredential.create({
            name: "Platform Admin",
            email: this.getConfiguredAdminEmail(),
            passwordHash,
        });

        return credential;
    }

    buildAdminProfile(credential) {
        return {
            name: credential?.name || "Platform Admin",
            email: credential?.email || this.getConfiguredAdminEmail(),
            role: UserRole.ADMIN,
            createdAt: credential?.createdAt || null,
            updatedAt: credential?.updatedAt || null,
        };
    }

    createAdminJwt(credential) {
        const profile = this.buildAdminProfile(credential);

        return jwtprovider.createJwt({
            email: profile.email,
            role: profile.role,
        });
    }

    async validateCredentials(email, password) {
        const credential = await this.getOrCreateAdminCredential();
        const normalizedEmail = this.normalizeEmail(email);
        const normalizedPassword = String(password || "");

        if (normalizedEmail !== credential.email) {
            throw new Error("Invalid admin email or password");
        }

        const isPasswordValid = await bcrypt.compare(normalizedPassword, credential.passwordHash);

        if (!isPasswordValid) {
            throw new Error("Invalid admin email or password");
        }

        return credential;
    }

    async login({ email, password }) {
        const credential = await this.validateCredentials(email, password);

        return {
            jwt: this.createAdminJwt(credential),
            admin: this.buildAdminProfile(credential),
        };
    }

    async getAdminFromPayload(payload) {
        const credential = await this.getOrCreateAdminCredential();
        const normalizedEmail = this.normalizeEmail(payload?.email);

        if (payload?.role !== UserRole.ADMIN) {
            throw new Error("Unauthorized role");
        }

        if (normalizedEmail !== credential.email) {
            throw new Error("Unauthorized admin");
        }

        return credential;
    }

    async validateToken(token) {
        const payload = jwtprovider.verifyJwt(token);
        const credential = await this.getAdminFromPayload(payload);
        return this.buildAdminProfile(credential);
    }

    async getAccount() {
        const credential = await this.getOrCreateAdminCredential();
        return this.buildAdminProfile(credential);
    }

    async updateAccount({ email, currentPassword, newPassword, confirmPassword }) {
        const credential = await this.getOrCreateAdminCredential();
        const normalizedCurrentPassword = String(currentPassword || "");

        if (!normalizedCurrentPassword) {
            throw new Error("Current password is required");
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            normalizedCurrentPassword,
            credential.passwordHash,
        );

        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        const normalizedEmail = this.normalizeEmail(email || credential.email);

        if (!normalizedEmail) {
            throw new Error("Admin email is required");
        }

        const normalizedNewPassword = String(newPassword || "");
        const normalizedConfirmPassword = String(confirmPassword || "");

        if (normalizedNewPassword) {
            if (normalizedNewPassword.length < 6) {
                throw new Error("New password must be at least 6 characters");
            }

            if (normalizedNewPassword !== normalizedConfirmPassword) {
                throw new Error("New password and confirm password must match");
            }

            credential.passwordHash = await bcrypt.hash(normalizedNewPassword, 10);
        }

        credential.email = normalizedEmail;
        await credential.save();

        return {
            jwt: this.createAdminJwt(credential),
            admin: this.buildAdminProfile(credential),
        };
    }
}

module.exports = new AdminService();
