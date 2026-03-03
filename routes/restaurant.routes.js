import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantStatus,
  toggleRestaurantOpen,
  toggleRestaurantBusy,
  addCategory,
  updateCategory,
  deleteCategory,
  addOffer,
  updateOffer,
  deleteOffer,
  updateSubscription,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

/* =========================================================
   BASE: /api/v1/admin/restaurants
========================================================= */

/* =============================
   CREATE RESTAURANT+
============================= */
router.post(
  "/create",
  protect,
  adminOnly,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createRestaurant
);
/* =============================
   GET ALL RESTAURANTS
============================= */
router.get("/all", protect, adminOnly, getAllRestaurants);

/* =============================
   GET SINGLE RESTAURANT
============================= */
router.get("/:restaurantId", protect, adminOnly, getRestaurantById);

/* =============================
   UPDATE RESTAURANT
============================= */
router.patch(
  "/:restaurantId",
  protect,
  adminOnly,
  upload.none(),
  updateRestaurant
);

/* =============================
   DELETE RESTAURANT (SOFT DELETE)
============================= */
router.delete("/:restaurantId", protect, adminOnly, deleteRestaurant);

/* =============================
   UPDATE STATUS (Approve/Reject)
============================= */
router.patch(
  "/:restaurantId/status",
  protect,
  adminOnly,
  updateRestaurantStatus
);

/* =============================
   TOGGLE OPEN
============================= */
router.patch(
  "/:restaurantId/toggle-open",
  protect,
  adminOnly,
  toggleRestaurantOpen
);

/* =============================
   TOGGLE BUSY
============================= */
router.patch(
  "/:restaurantId/toggle-busy",
  protect,
  adminOnly,
  toggleRestaurantBusy
);

/* =========================================================
   CATEGORY ROUTES
========================================================= */

/* Add Category */
router.post(
  "/:restaurantId/categories",
  protect,
  adminOnly,
  addCategory
);

/* Update Category */
router.patch(
  "/:restaurantId/categories/:categoryId",
  protect,
  adminOnly,
  updateCategory
);

/* Delete Category */
router.delete(
  "/:restaurantId/categories/:categoryId",
  protect,
  adminOnly,
  deleteCategory
);

/* =========================================================
   OFFER ROUTES
========================================================= */

/* Add Offer */
router.post(
  "/:restaurantId/offers",
  protect,
  adminOnly,
  addOffer
);

/* Update Offer */
router.patch(
  "/:restaurantId/offers/:offerId",
  protect,
  adminOnly,
  updateOffer
);

/* Delete Offer */
router.delete(
  "/:restaurantId/offers/:offerId",
  protect,
  adminOnly,
  deleteOffer
);

/* =========================================================
   SUBSCRIPTION ROUTE
========================================================= */

router.patch(
  "/:restaurantId/subscription",
  protect,
  adminOnly,
  updateSubscription
);

export default router;