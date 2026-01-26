import { ApiError } from "../utils/ApiError.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error("🔥 AsyncHandler Error:", error);

    // If already ApiError → pass through
    if (error instanceof ApiError) {
      return next(error);
    }

    // Otherwise wrap into ApiError
    return next(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error",
        error.errors || ["Unexpected server error"],
        error.stack
      )
    );
  }
};

export { asyncHandler };
