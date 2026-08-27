const mongoose = require("mongoose");

async function connectDatabase() {
    try {
        const uri = process.env.MONGODB_URI;

        console.log("MongoDB URI exists:", !!uri);
        console.log(
            "MongoDB URI starts with:",
            uri ? uri.substring(0, 20) : "undefined"
        );

        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    }
}

module.exports = connectDatabase;
