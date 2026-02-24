import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtp, verifyOtp } from "../services/otp.service.js";

/**
 * ============================
 * LOGIN CONTROLLER
 * ============================
 */
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
    role = role.trim();

    // 🔒 Only allow user & restaurant roles
    const allowedRoles = ["user", "restaurant"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const user = await User.findOne({ mobile, role });

    // If user exists and already verified → direct login
    if (user && user.isVerified) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Login successful",
        user,
      });
    }

    // Otherwise send OTP
    await sendOtp(mobile, role);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      requiresOtp: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ============================
 * VERIFY OTP CONTROLLER
 * ============================
 */
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

    // 🔥 Verify OTP and get role from OTP service
    const role = await verifyOtp(mobile, otp);

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // 🔒 Double safety — block admin from OTP system
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin login is not allowed via OTP",
      });
    }

    let user = await User.findOne({ mobile, role });

    // Create new user if not exists
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
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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