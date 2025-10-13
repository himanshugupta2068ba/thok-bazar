const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    locality: {
        type: String
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    address: {
        type: String
    },
    mobile:{
        type: String,
    }
}, { timestamps: true });


const Address = mongoose.model('Address', addressSchema);
module.exports = Address;