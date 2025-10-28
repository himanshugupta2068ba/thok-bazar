const mongoose = require('mongoose');
const UserRole = require('../domain/UserRole');
const AccountStatus = require('../domain/AccountStatus');

const sellerSchema = new mongoose.Schema({
    sellerName: {
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    businessDetails:{
        businessName:{
            type: String,
        },
        businessEmail:{
            type: String,
        },
        businessMobile:{
            type: String,
        },
        businessAddress:{
            type: String,
        }
    },
    bankDetails:{
        accountNumber:{
            type: String,
        },
        accountHolderName:{
            type: String,
        },
        bankName:{
            type: String,
        },
        ifscCode:{
            type: String,
        }
    },
    pickupAddress:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    GSTIN:{
        type: String,
    },
    role:{
        type: String,
        enum: [ UserRole.SELLER],
        default: UserRole.SELLER
    },
    accountStatus:{
        type: String,
        enum:[AccountStatus.PENDING_VERIFICATION,
            AccountStatus.ACTIVE,
            AccountStatus.INACTIVE,
            AccountStatus.SUSPENDED,
            AccountStatus.BLOCKED,
            AccountStatus.CLOSED],
        default: AccountStatus.PENDING_VERIFICATION
    }
}, {timestamps: true});

const Seller= mongoose.model('Seller', sellerSchema);
module.exports = Seller;


   