const mongoose = require("mongoose");

const getMongoUri = () => {
    const mongoUri = String(
        process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || "",
    ).trim();

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not configured");
    }

    return mongoUri;
};

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(getMongoUri());
        console.log("MongoDB connected:", conn.connection.host);
        return conn;
    }
    catch (err) {
        console.error("MongoDB connection failed:", err?.message || err);
        throw err;
    }
};

module.exports = connectDb;
