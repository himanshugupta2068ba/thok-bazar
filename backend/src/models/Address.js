const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    locality: String,
    pincode: {
        type: String,
        required: true
    },
    state: String,
    address: String,
    mobile: String
}, { timestamps: true });

module.exports =
    mongoose.models.Address ||
    mongoose.model("Address", addressSchema);
