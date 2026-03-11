import express from "express";
import { protect,userProtect } from "../middlewares/auth.middleware.js";
import { getUserProfile, updateUserProfile, getUserProfileCompletion } from "../controllers/userself.controller.js";

const router = express.Router();

router.get("/profile", protect, userProtect, getUserProfile);
router.put("/profile", protect, userProtect, updateUserProfile);
router.get("/profile-completion", protect, userProtect, getUserProfileCompletion);

export default router;