import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

import { getAllOwners } from "../controllers/admin.restaurant.owner.controller.js";
const router = express.Router();
router.get("/all",protect,adminOnly, getAllOwners);
export default router;