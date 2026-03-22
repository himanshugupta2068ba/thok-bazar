const mongoose = require("mongoose");

const adminCredentialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "Platform Admin",
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("AdminCredential", adminCredentialSchema);
