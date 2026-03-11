import express from "express";
import { createAdmin, adminLogin,adminLogout } from "../controllers/admin.controller.js";

const router = express.Router();

// Use createAdmin ONLY once then remove it
router.post("/create", createAdmin);

router.post("/login", adminLogin);
router.post("/logout", adminLogout);

export default router;