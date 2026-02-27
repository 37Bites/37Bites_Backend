import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js"; // ✅ ADD THIS

import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantStatus,
  toggleRestaurantOpen,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

// Create restaurant (with image upload)
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // ✅ ADD THIS
  createRestaurant
);

// Get all restaurants
router.get("/", protect, adminOnly, getAllRestaurants);

// Get single restaurant
router.get("/:id", protect, adminOnly, getRestaurantById);

// Update restaurant
router.put("/:id", protect, adminOnly, updateRestaurant);

// Delete restaurant
router.delete("/:id", protect, adminOnly, deleteRestaurant);

// Update restaurant approval/status
router.patch("/:id/status", protect, adminOnly, updateRestaurantStatus);

// Toggle open/close restaurant
router.patch("/:id/toggle-open", protect, adminOnly, toggleRestaurantOpen);

export default router;