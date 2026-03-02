import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../controllers/user.controller.js";

const router = express.Router();

/* ==========================================
   ADMIN USER ROUTES
   Base: /api/v1/users
========================================== */

// Create User
router.post("/create", protect, adminOnly, createUser);

// Get All Users
router.get("/all", protect, adminOnly, getAllUsers);

// Get Single User
router.get("/:userId", protect, adminOnly, getUserById);

// Update User
router.patch("/:userId", protect, adminOnly, updateUser);

// Toggle Active Status
router.patch("/:userId/status", protect, adminOnly, toggleUserStatus);

// Delete User
router.delete("/:userId", protect, adminOnly, deleteUser);

export default router;