import { User } from "../models/User.model.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { mailSender } from "../utils/mailSender.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Otp } from "../models/Otp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerOtpSender = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(
      400,
      "All fields (username, email, password) are required"
    );
  }

  const user = await User.findOne({
    $or: [{ email }, { username: username.toLowerCase() }],
  });

  if (user && user.username === username.toLowerCase() && user.email !== email) {
    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Username already taken. Please choose another username."
      )
    );
  }

  if (user) {
    switch (user.isUserDetailsComplete) {
      case "true":
        return res.status(200).json(
          new ApiResponse(200, null, "Account already exists. Please log in.")
        );

      case "partial":
        return res.status(200).json(
          new ApiResponse(
            200,
            null,
            "Email already verified. Please complete your profile."
          )
        );

      case "false": {
        const existingOtp = await Otp.findOne({ email });

        if (existingOtp) {
          return res.status(200).json(
            new ApiResponse(
              200,
              null,
              "OTP already sent. Please check your email."
            )
          );
        }

        const otp = otpGenerator();
        await Otp.create({ email, otp });
        await mailSender(email, otp);

        return res.status(200).json(
          new ApiResponse(
            200,
            null,
            "OTP sent successfully! Please verify your email."
          )
        );
      }

      default:
        throw new ApiError(500, "Invalid user state");
    }
  }

  const otp = otpGenerator();

  await User.create({
    username: username.toLowerCase(),
    email,
    password,
    isUserDetailsComplete: "false",
  });

  await Otp.create({ email, otp });
  await mailSender(email, otp);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "OTP sent successfully! Please verify your email."
    )
  );
});


export const registerOtpVerifier = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

  const otpData = await Otp.findOne({ email });

  if (!otpData)
    throw new ApiError(404, "No OTP found. Please request a new one.");

  if (otpData.otp !== Number(otp)) {
    throw new ApiError(401, "Invalid OTP");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  if (user.isUserDetailsComplete !== "false") {
    throw new ApiError(
      409,
      "OTP already verified or registration already completed."
    );
  }

  await User.findByIdAndUpdate(user.id, {
    isUserDetailsComplete: "partial",
  });
  await Otp.findByIdAndDelete(otpData.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  return res.json(
    new ApiResponse(
      200,
      { status: "partial" },
      "OTP verified successfully. Please complete your profile!"
    )
  );
});
