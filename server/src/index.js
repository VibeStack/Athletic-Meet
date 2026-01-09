import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {

      app.on("error", (error) => {
        console.log("Error:", error);
        process.exit(1);
      });

      console.log(
        `⚙️ Server running at port http://localhost:${process.env.PORT} `
      );

    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error (src/index.js) !!", err);
  });
