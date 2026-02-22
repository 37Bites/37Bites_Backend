import User from "../models/User.js";
import { sendOtp, verifyOtp } from "./otp.service.js";
import { generateToken } from "./token.service.js";

export const sendOtpService = async (mobile, role) => {
  let user = await User.findOne({ mobile });

  if (user && user.isVerified) {
    const token = generateToken({ id: user._id, role: user.role });
    return { verified: true, token };
  }

  if (!user) {
    user = await User.create({ mobile, role });
  }

  await sendOtp(mobile);

  return { verified: false };
};

export const verifyOtpService = async (mobile, otp) => {
  const isValid = await verifyOtp(mobile, otp);
  if (!isValid) throw new Error("Invalid or expired OTP");

  const user = await User.findOne({ mobile });
  user.isVerified = true;
  await user.save();

  const token = generateToken({ id: user._id, role: user.role });

  return token;
};