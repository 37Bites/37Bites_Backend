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
    }

    if (!token && req.cookies.token) {
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

    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.userId).select("-password");
    } else {
      account = await User.findById(decoded.userId);
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    // ✅ Set clean user object WITH role
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