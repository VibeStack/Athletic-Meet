import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser(process.env.MY_SECRET_KEY));
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-client-key",
      "x-client-token",
      "x-client-secret",
    ],
    credentials: true,
  })
);

import userRouter from "./routes/user.routes.js";
import otpRouter from "./routes/emailOtp.routes.js";
import authLoginRouter from "./routes/authLogin.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { checkAuth, requireAdmin } from "./middlewares/auth.middleware.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/auth", authLoginRouter);
app.use("/api/v1/admin", checkAuth, requireAdmin, adminRouter);

app.use(errorHandler);

export { app };
