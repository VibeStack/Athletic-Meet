import { User } from "../models/User.model.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { mailSender } from "../utils/mailSender.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Otp } from "../models/Otp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerOtpSender = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedUsername = username?.toLowerCase().trim();

  if (!username || !email || !password) {
    throw new ApiError(
      400,
      "All fields (username, email, password) are required"
    );
  }

  const user = await User.findOne({
    $or: [{ email }, { username: normalizedUsername }],
  });

  if (user) {
    if (user.username === normalizedUsername && user.email !== email) {
      throw new ApiError(409, "Username already taken.");
    }
    if (user.email === email && user.username !== normalizedUsername) {
      throw new ApiError(409, "Email already linked to another username.");
    }
  }

  if (user) {
    switch (user.isUserDetailsComplete) {
      case "true":
        return res
          .status(200)
          .json(
            new ApiResponse(null, "Account already exists. Please log in.")
          );

      case "partial":
        return res
          .status(200)
          .json(
            new ApiResponse(
              null,
              "Email already verified. Please complete your profile."
            )
          );

      case "false": {
        const existingOtp = await Otp.findOne({ email });

        if (existingOtp) {
          return res
            .status(200)
            .json(
              new ApiResponse(
                null,
                "OTP already sent. Please wait before requesting again."
              )
            );
        }

        const otp = otpGenerator();

        await Otp.findOneAndUpdate(
          { email },
          { otp, createdAt: new Date() },
          { upsert: true, new: true }
        );

        mailSender(email, otp).catch((err) => {
          console.error("❌ Email send failed:", err.message);
        });

        return res
          .status(200)
          .json(
            new ApiResponse(
              null,
              "OTP sent successfully! Please verify your email."
            )
          );
      }

      default:
        throw new ApiError(
          500,
          "Something went wrong while processing your request. Please try again later"
        );
    }
  }

  const otp = otpGenerator();

  await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        username: normalizedUsername,
        email,
        password,
        isUserDetailsComplete: "false",
      },
    },
    { upsert: true, new: true }
  );

  await Otp.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  mailSender(email, otp).catch((err) => {
    console.error("❌ Email send failed:", err.message);
  });

  return res
    .status(200)
    .json(
      new ApiResponse(null, "OTP sent successfully! Please verify your email.")
    );
});

export const registerOtpVerifier = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

  const otpData = await Otp.findOneAndDelete({ email });

  if (!otpData)
    throw new ApiError(404, "No OTP found. Please request a new one.");

  if (String(otpData.otp) !== String(otp)) {
    throw new ApiError(401, "Invalid OTP");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  if (user.isUserDetailsComplete !== "false") {
    throw new ApiError(409, "OTP already verified or registration completed.");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email, isUserDetailsComplete: "false" },
    { $set: { isUserDetailsComplete: "partial" } },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(409, "OTP already verified or user state invalid.");
  }

  return res.json(
    new ApiResponse(
      null,
      "OTP verified successfully. Please complete your profile!"
    )
  );
});
