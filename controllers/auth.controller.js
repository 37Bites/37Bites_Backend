import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Delivery from "../models/Delivery.js"; 
import { sendOtp, verifyOtp } from "../services/otp.service.js";

/**
 * ============================
 * LOGIN CONTROLLER
 * ============================
 */

const TEST_NUMBERS = process.env.TEST_NUMBERS
  ? process.env.TEST_NUMBERS.split(",")
  : [];

const TEST_OTP = process.env.TEST_OTP;
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

    const allowedRoles = ["user", "restaurant", "delivery"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }
    if (TEST_NUMBERS.includes(mobile)) {
      console.log(`Test OTP for ${mobile}: ${TEST_OTP}`);

      return res.json({
        success: true,
        message: "Test OTP ready",
        requiresOtp: true,
      });
    }
    // 🔹 Always send OTP (no auto login)
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




// export const verifyOtpController = async (req, res, next) => {
//   try {
//     let { mobile, role, otp } = req.body;

//     if (!mobile || !otp || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "Mobile, role and OTP are required",
//       });
//     }

//     mobile = mobile.trim();
//     otp = otp.trim();
//     role = role.trim();

//     const allowedRoles = ["user", "restaurant", "delivery"];

//     if (!allowedRoles.includes(role)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid role selected",
//       });
//     }

//     const otpRole = await verifyOtp(mobile, otp);

//     if (!otpRole) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     let user = await User.findOne({ mobile, role });

//     // 🔹 First time user
//     if (!user) {
//       user = await User.create({
//         mobile,
//         role,
//         isVerified: true,
//       });
//     }

//     // 🔹 Mark verified if not already
//     if (!user.isVerified) {
//       user.isVerified = true;
//       await user.save();
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     let isProfileComplete = true;

//     if (user.role === "delivery") {
//       const deliveryProfile = await Delivery.findOne({ user: user._id });
//       isProfileComplete = deliveryProfile ? true : false;
//     }

//     return res.json({
//       success: true,
//       message: "Login successful",
//       user,
//       isProfileComplete,
//     });

//   } catch (error) {
//     next(error);
//   }
// };

export const verifyOtpController = async (req, res, next) => {
  try {
    let { mobile, role, otp } = req.body;

    if (!mobile || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: "Mobile, role and OTP are required",
      });
    }

    mobile = mobile.trim();
    otp = otp.trim();
    role = role.trim();

    const allowedRoles = ["user", "restaurant", "delivery"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // 🔹 Load test config from ENV
    const TEST_NUMBERS = process.env.TEST_NUMBERS
      ? process.env.TEST_NUMBERS.split(",")
      : [];

    const TEST_OTP = process.env.TEST_OTP;

    let otpRole;

    // 🧪 Test numbers verification
    if (TEST_NUMBERS.includes(mobile) && otp === TEST_OTP) {
      otpRole = role;
    } else {
      otpRole = await verifyOtp(mobile, otp);
    }

    if (!otpRole) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    let user = await User.findOne({ mobile, role });

    // 🔹 First time user
    if (!user) {
      user = await User.create({
        mobile,
        role,
        isVerified: true,
      });
    }

    // 🔹 Mark verified if not already
    if (!user.isVerified) {
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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