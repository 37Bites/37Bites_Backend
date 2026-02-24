import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

// Admin Protected Routes
router.post("/", protect, adminOnly, createRestaurant);
router.get("/", protect, adminOnly, getAllRestaurants);
router.get("/:id", protect, adminOnly, getRestaurantById);
router.put("/:id", protect, adminOnly, updateRestaurant);
router.delete("/:id", protect, adminOnly, deleteRestaurant);

export default router;