import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import connectDB from "./db/index.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();
    console.log("🟢 Database connection established");

    const server = app.listen(PORT, () => {
      console.log(`⚙️ Server running at http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("🚨 Server startup failed");

      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use`);
      } else if (error.code === "EACCES") {
        console.error(`❌ Permission denied for port ${PORT}`);
      } else {
        console.error("❌ Unknown server error:", error);
      }

      process.exit(1);
    });

    const shutdown = async (signal) => {
      console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);

      try {
        await mongoose.disconnect();
        console.log("✅ MongoDB disconnected");
      } catch (dbError) {
        console.error("❌ Error disconnecting MongoDB:", dbError);
      }

      server.close(() => {
        console.log("🛑 HTTP server closed");
        process.exit(0);
      });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);

  } catch (error) {
    console.error("🔥 Application startup failed");
    console.error(error);
    process.exit(1);
  }
})();
