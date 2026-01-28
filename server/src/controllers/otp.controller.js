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
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedUsername || !normalizedEmail || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // 1️⃣ Fetch user once (lean = faster, lower memory)
  const user = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  }).lean();

  // 2️⃣ Conflict checks
  if (user) {
    if (
      user.username === normalizedUsername &&
      user.email !== normalizedEmail
    ) {
      throw new ApiError(409, "Username already taken.");
    }
    if (
      user.email === normalizedEmail &&
      user.username !== normalizedUsername
    ) {
      throw new ApiError(409, "Email already linked to another username.");
    }
  }

  // 3️⃣ If fully registered → stop
  if (user?.isUserDetailsComplete === "true") {
    return res
      .status(200)
      .json(new ApiResponse(null, "Account already exists. Please log in."));
  }

  // 4️⃣ If email already verified → stop
  if (user?.isUserDetailsComplete === "partial") {
    return res
      .status(200)
      .json(
        new ApiResponse(
          null,
          "Email already verified. Please complete your profile."
        )
      );
  }

  // 5️⃣ OTP rate-limit + update in ONE ATOMIC QUERY (NO RACE CONDITION)
  const now = Date.now();
  const otp = otpGenerator(); // MUST RETURN STRING

  const otpDoc = await Otp.findOneAndUpdate(
    {
      email: normalizedEmail,
      $or: [
        { createdAt: { $lt: new Date(now - 5 * 60 * 1000) } }, // expired
        { createdAt: { $exists: false } }, // none exists
      ],
    },
    {
      $set: {
        otp,
        createdAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  // 6️⃣ If OTP NOT updated → still valid → block resend
  if (!otpDoc) {
    const existing = await Otp.findOne({ email: normalizedEmail }).lean();

    const ageMs = Date.now() - existing.createdAt.getTime();
    const remainingMs = 5 * 60 * 1000 - ageMs;
    const remainingMinutes = Math.ceil(remainingMs / 60000);

    return res
      .status(200)
      .json(
        new ApiResponse(
          { remainingMinutes },
          `OTP already sent. You can request a new OTP after ${remainingMinutes} minute(s).`
        )
      );
  }

  // 7️⃣ Ensure user exists without overwriting
  await User.updateOne(
    { email: normalizedEmail },
    {
      $setOnInsert: {
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        role: "Student",
        isUserDetailsComplete: "false",
        isEventsLocked: false,
      },
    },
    { upsert: true }
  );

  // 8️⃣ Send email async (NON-BLOCKING, SAFE)
  mailSender(normalizedEmail, otp).catch((err) => {
    console.error("❌ OTP Mail Failed:", normalizedEmail, err.message);
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
