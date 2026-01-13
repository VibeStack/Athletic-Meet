import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error Handler:",err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: err.data,
      message: err.message,
      success: err.success,
      error: err.error,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    data: null,
    message: "Internal Server Error",
    success: false,
    error: [err.message],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
