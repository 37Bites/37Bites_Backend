import express from "express";
import multer from "multer";

import {
  createAdmin,
  adminLogin,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

/* AUTH */
router.post("/create", createAdmin); // use once
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

/* PROFILE */
router.get("/profile", protect, adminOnly, getAdminProfile);

router.put("/update-profile", protect, adminOnly, updateAdminProfile);

/* IMAGE UPLOAD */
router.post(
  "/upload-profile-image",
  protect,
  adminOnly,
  upload.single("profileImage"),
  uploadAdminProfileImage
);

export default router;