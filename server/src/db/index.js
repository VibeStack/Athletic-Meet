import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Global cached connection for serverless (Vercel-safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // If connection already exists, reuse it
    if (cached.conn) {
      console.log("✅ MongoDB already connected");
      return cached.conn;
    }

    // If connection is in progress, wait for it
    if (!cached.promise) {
      cached.promise = mongoose.connect(
        `${process.env.MONGODB_URI}/${DB_NAME}`,
        {
          autoIndex: false, // safer for production
          maxPoolSize: 10, // LIMIT DB CONNECTIONS (IMPORTANT for Atlas M0)
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      );
    }

    const connection = await cached.promise;

    cached.conn = connection;

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

    // ❌ DO NOT kill process on Vercel
    throw error;
  }
};

export default connectDB;
