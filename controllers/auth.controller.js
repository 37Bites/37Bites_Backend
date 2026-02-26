import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Delivery from "../models/Delivery.js"; 
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

    // 🔒 Allow user, restaurant & delivery
    const allowedRoles = ["user", "restaurant", "delivery"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const user = await User.findOne({ mobile, role });

  
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

    
      let isProfileComplete = true;

      if (user.role === "delivery") {
        const deliveryProfile = await Delivery.findOne({ user: user._id });
        isProfileComplete = deliveryProfile ? true : false;
      }

      return res.json({
        success: true,
        message: "Login successful",
        user,
        isProfileComplete,
      });
    }


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

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin login is not allowed via OTP",
      });
    }

    let user = await User.findOne({ mobile, role });

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

   
    let isProfileComplete = true;

    if (user.role === "delivery") {
      const deliveryProfile = await Delivery.findOne({ user: user._id });
      isProfileComplete = deliveryProfile ? true : false;
    }

    return res.json({
      success: true,
      message: "Login successful",
      user,
      isProfileComplete,
    });

  } catch (error) {
    next(error);
  }
};