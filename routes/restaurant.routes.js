// routes/restaurantRoutes.js
import express from "express";
import {
  getProfile,
  updateProfile,
    getProfileCompletion,
//   getTracker

} from "../controllers/restaurant.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // your existing JWT middleware

const router = express.Router();

/* ================================
   Role Middleware: Restaurant Only
=================================*/
const restaurantProtect = (req, res, next) => {
  if (req.user.role !== "restaurant") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only restaurant users allowed.",
    });
  }
  next();
};

/* ================================
   ROUTES
=================================*/
// GET restaurant profile
router.get("/profile", protect, restaurantProtect, getProfile);

// UPDATE restaurant profile
router.put("/profile", protect, restaurantProtect, updateProfile);
router.get("/profile-completion", protect, restaurantProtect, getProfileCompletion);

// GET tracker stats
// router.get("/tracker", protect, restaurantProtect, getTracker);


export default router;