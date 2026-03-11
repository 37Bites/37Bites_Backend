import express from "express";
import { protect, deliveryProtect } from "../middlewares/auth.middleware.js";
import {
  getDeliveryProfile,
  updateDeliveryProfile,
  getDeliveryProfileCompletion
} from "../controllers/delivery.controller.js";

const router = express.Router();

// ✅ Protect routes: first check token, then role
router.get("/profile", protect, deliveryProtect, getDeliveryProfile);
router.put("/profile", protect, deliveryProtect, updateDeliveryProfile);
router.get("/profile-completion", protect, deliveryProtect, getDeliveryProfileCompletion);

export default router;