import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      console.log("✅ MongoDB already connected");
      return mongoose.connection;
    }

    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log("🟢 MongoDB connected successfully");
    console.log(`📦 Database: ${connection.connection.name}`);
    console.log(`🌐 Host: ${connection.connection.host}`);

    return connection.connection;

  } catch (error) {
    console.error("🔥 MongoDB connection failed");

    if (error.name === "MongoNetworkError") {
      console.error("❌ Network error: Unable to reach MongoDB server");
    } else if (error.name === "MongoServerSelectionError") {
      console.error("❌ Server selection failed (check URI / IP whitelist)");
    } else if (error.message?.includes("auth")) {
      console.error("❌ Authentication failed (check username/password)");
    } else {
      console.error("❌ Unknown MongoDB error:", error);
    }

    process.exit(1);
  }
};

export default connectDB;
