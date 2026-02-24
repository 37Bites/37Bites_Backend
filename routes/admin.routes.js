import express from "express";
import { createAdmin, adminLogin } from "../controllers/admin.controller.js";

const router = express.Router();

// Use createAdmin ONLY once then remove it
router.post("/create", createAdmin);

router.post("/login", adminLogin);

export default router;