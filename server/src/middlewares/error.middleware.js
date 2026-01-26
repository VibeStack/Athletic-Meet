import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);
  console.log("🔍 err.errors value:", err.errors);
  console.log("🔍 Is array?:", Array.isArray(err.errors));

  // Handle ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: Array.isArray(err.errors) ? err.errors : [],
      data: null,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Unknown errors fallback
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || "Internal Server Error",
    errors: [],
    data: null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
