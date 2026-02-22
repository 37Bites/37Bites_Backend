import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtp, verifyOtp } from "../services/otp.service.js";

// LOGIN
export const loginController = async (req, res, next) => {
  try {
    let { mobile, role } = req.body;

    if (!mobile || !role) {
      return res.status(400).json({
        success: false,
        message: "Mobile and role are required",
      });
    }

    mobile = mobile.trim();

    const user = await User.findOne({ mobile, role });

    if (user && user.isVerified) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Login successful",
        user,
      });
    }

    await sendOtp(mobile, role);

    return res.json({
      success: true,
      message: "OTP sent",
      requiresOtp: true,
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY OTP
export const verifyOtpController = async (req, res, next) => {
  try {
    let { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile and OTP are required",
      });
    }

    mobile = mobile.trim();
    otp = otp.trim();

    const role = await verifyOtp(mobile, otp);

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    let user = await User.findOne({ mobile, role });

    // 🚫 prevent admin self creation
    if (!user && role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account does not exist",
      });
    }

    if (!user) {
      user = await User.create({
        mobile,
        role,
        isVerified: true,
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};