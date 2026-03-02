import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

import {
  adminCreateDelivery,
  adminGetAllDeliveries,
  adminGetDeliveryById,
  adminUpdateDelivery,
  adminDeleteDelivery,
} from "../controllers/admin.delivery.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, adminCreateDelivery);
router.get("/", protect, adminOnly, adminGetAllDeliveries);
router.get("/:id", protect, adminOnly, adminGetDeliveryById);
router.put("/:id", protect, adminOnly, adminUpdateDelivery);
router.delete("/:id", protect, adminOnly, adminDeleteDelivery);

export default router;