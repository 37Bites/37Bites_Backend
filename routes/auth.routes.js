import express from "express";
import {
  loginController,
  verifyOtpController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);
router.post("/logout", logoutController);

export default router;