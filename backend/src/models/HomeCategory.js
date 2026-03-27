const mongoose = require("mongoose");
const HomeCategorySection = require("../domain/HomeCategorySection");

const homeCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true,
        index: true
    },
    section: {
        type: String,
        enum: Object.values(HomeCategorySection),
        required: true
    }
}, { timestamps: true });

module.exports =
    mongoose.models.HomeCategory ||
    mongoose.model("HomeCategory", homeCategorySchema);
