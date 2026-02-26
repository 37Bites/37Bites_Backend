import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;

    // 🔹 Admin account
    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.userId).select("-password");
    } 
    // 🔹 All other roles from User collection
    else {
      account = await User.findById(decoded.userId);
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    // 🔐 Extra Security: Prevent role tampering
    if (account.role && account.role !== decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Role mismatch",
      });
    }

    req.user = {
      id: account._id,
      role: decoded.role,
      data: account,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};