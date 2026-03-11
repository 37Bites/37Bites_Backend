import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  createDeliveryProfile,
  getMyDeliveryProfile,
  updateDeliveryProfile,
  
} from "../controllers/delivery.controller.js";

const router = express.Router();

// Create profile
router.post("/profile", protect, createDeliveryProfile);

// Get logged-in delivery profile
router.get("/profile", protect, getMyDeliveryProfile);

// Update profile
router.put("/profile", protect, updateDeliveryProfile);

export default router;