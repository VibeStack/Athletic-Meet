import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connetionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB Connected !! DB Host: ${connetionInstance.connection.host}`
    );
  } catch (error) {
    console.log("\n\nMongoDB Connection Failed! (src/db/index.js)\n\n", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("✅ Client Disconnected!");
  process.exit(0);
});

export default connectDB;
