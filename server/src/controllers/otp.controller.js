import { User } from "../models/User.model.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { mailSender } from "../utils/mailSender.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Otp } from "../models/Otp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

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
  });

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

  if (
    user?.isUserDetailsComplete === "false" &&
    !(await user.comparePassword(password))
  ) {
    throw new ApiError(400, "Invalid Credentials.");
  }

  // 3️⃣ If email already verified → stop
  if (user?.isUserDetailsComplete === "partial") {
    if (!user.comparePassword(password)) {
      throw new ApiError(400, "Invalid Credentials.");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          null,
          "Email already verified. Please complete your profile."
        )
      );
  }

  // 4️⃣ If fully registered → stop
  if (user?.isUserDetailsComplete === "true") {
    return res
      .status(200)
      .json(new ApiResponse(null, "Account already exists. Please log in."));
  }

  const now = Date.now();
  const otpExpiryMs = 5 * 60 * 1000;

  // 🔍 Check existing OTP
  const existingOtp = await Otp.findOne({ email: normalizedEmail }).lean();

  // ✅ If OTP exists and still valid → BLOCK resend
  if (existingOtp) {
    const ageMs = now - new Date(existingOtp.createdAt).getTime();

    if (ageMs < otpExpiryMs) {
      const remainingMs = otpExpiryMs - ageMs;
      const remainingMinutes = Math.ceil(remainingMs / 60000);

      return res
        .status(200)
        .json(
          new ApiResponse(
            { remainingMinutes },
            "OTP already sent. Please check your email."
          )
        );
    }
  }

  // ✅ OTP expired OR doesn't exist → Generate new
  const otp = otpGenerator();

  await Otp.updateOne(
    { email: normalizedEmail },
    {
      $set: {
        otp,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  const hashedPassword = await bcrypt.hash(password, 12);

  // 7️⃣ Ensure user exists without overwriting
  await User.updateOne(
    { email: normalizedEmail },
    {
      $setOnInsert: {
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        role: "Student",
        isUserDetailsComplete: "false",
        isEventsLocked: false,
      },
    },
    { upsert: true }
  );

  // 8️⃣ Send email async (NON-BLOCKING, SAFE)
  try {
    await mailSender(normalizedEmail, otp);
  } catch (err) {
    console.error("❌ OTP Mail Failed:", normalizedEmail, err.message);

    // Optional rollback OTP so user can retry
    await Otp.deleteOne({ email: normalizedEmail });

    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(null, "OTP sent successfully! Please verify your email.")
    );
});

export const getAllActiveOtps = asyncHandler(async (req, res) => {
  const otpExpiryMs = 5 * 60 * 1000; // 5 minutes
  const now = Date.now();

  // Fetch all OTPs
  const otps = await Otp.find({}).lean();

  // Get user info for each OTP email
  const otpData = await Promise.all(
    otps.map(async (otp) => {
      const user = await User.findOne({ email: otp.email })
        .select("username")
        .lean();

      const createdAtMs = new Date(otp.createdAt).getTime();
      const expiresAtMs = createdAtMs + otpExpiryMs;
      const remainingMs = Math.max(0, expiresAtMs - now);

      return {
        email: otp.email,
        username: user?.username || "Unknown",
        otp: otp.otp,
        createdAt: otp.createdAt,
        expiresAt: new Date(expiresAtMs),
        remainingMs,
        attempts: otp.attempts,
      };
    })
  );

  // Filter out expired OTPs and sort by newest first
  const activeOtps = otpData
    .filter((otp) => otp.remainingMs > 0)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res
    .status(200)
    .json(new ApiResponse(activeOtps, "Active OTPs fetched successfully."));
});

export const registerOtpVerifier = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !otp) {
    throw new ApiError(400, "Email and OTP are required.");
  }

  // 🔍 Check user exists
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const otpExpiryMs = 5 * 60 * 1000;
  const now = Date.now();

  // 🔍 Fetch OTP document
  const otpDoc = await Otp.findOne({ email: normalizedEmail });

  if (!otpDoc) {
    throw new ApiError(400, "No OTP found. Please request a new one.");
  }

  // ⏳ Expiry check
  const ageMs = now - new Date(otpDoc.createdAt).getTime();

  if (ageMs > otpExpiryMs) {
    await Otp.deleteOne({ email: normalizedEmail });
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }

  // ❌ WRONG OTP → atomic attempt increment
  if (otpDoc.otp !== otp) {
    const updated = await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { $inc: { attempts: 1 } },
      { new: true }
    );

    // 🚫 If attempts >= 3 → expire OTP
    if (updated.attempts >= 3) {
      await Otp.deleteOne({ email: normalizedEmail });

      throw new ApiError(
        400,
        "Too many invalid attempts. OTP expired. Please request a new one."
      );
    }

    throw new ApiError(
      400,
      `Invalid OTP. ${3 - updated.attempts} attempt(s) remaining.`
    );
  }

  // ✅ CORRECT OTP → atomic consume OTP
  const consumedOtp = await Otp.findOneAndDelete({
    email: normalizedEmail,
    otp,
  });

  // ⚠️ If OTP was already used by another request
  if (!consumedOtp) {
    throw new ApiError(
      400,
      "OTP already used or expired. Please request a new one."
    );
  }

  // ✅ Mark user verified
  await User.updateOne(
    { email: normalizedEmail },
    { $set: { isUserDetailsComplete: "partial" } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        null,
        "OTP verified successfully. Please complete your profile!"
      )
    );
});
