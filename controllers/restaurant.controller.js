import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";


import slugify from "slugify";

export const createRestaurant = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Auto from token

    const {
      name,
      description,
      restaurantType,
      cuisines,
      serviceType,
      averageCostForTwo,
      address,
      timings,
      autoAcceptOrders,
      preparationTimeInMinutes,
      deliveryTimeInMinutes,
      deliveryRadiusInKm,
      minimumOrderAmount,
      packagingCharge,
      paymentMethods,
      canAddCategory,
      categories,
      offers,
      socialLinks,
      seoTitle,
      seoDescription,
      subscriptionPlan,
    } = req.body;

    /* ================================
       REQUIRED FIELD VALIDATION
    =================================*/
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Restaurant name is required",
      });
    }

    if (!address || !address.location || !address.location.coordinates) {
      return res.status(400).json({
        success: false,
        message: "Address with valid coordinates is required",
      });
    }

    /* ================================
       CHECK IF USER ALREADY HAS RESTAURANT
    =================================*/
    const existingRestaurant = await Restaurant.findOne({ user: userId });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "User already owns a restaurant",
      });
    }

    /* ================================
       GENERATE SLUG
    =================================*/
    const slug = slugify(name, { lower: true, strict: true });

    /* ================================
       CREATE RESTAURANT
    =================================*/
    const restaurant = await Restaurant.create({
      user: userId,
      name,
      slug,
      description,
      restaurantType,
      cuisines,
      serviceType,
      averageCostForTwo,

      address: {
        ...address,
        location: {
          type: "Point",
          coordinates: address.location.coordinates,
        },
      },

      timings,
      autoAcceptOrders,
      preparationTimeInMinutes,
      deliveryTimeInMinutes,
      deliveryRadiusInKm,
      minimumOrderAmount,
      packagingCharge,

      paymentMethods,
      canAddCategory,
      categories,
      offers,

      profileImage: req.files?.profileImage?.[0]
        ? {
            url: req.files.profileImage[0].path,
            publicId: req.files.profileImage[0].filename,
          }
        : undefined,

      coverImage: req.files?.coverImage?.[0]
        ? {
            url: req.files.coverImage[0].path,
            publicId: req.files.coverImage[0].filename,
          }
        : undefined,

      socialLinks,
      seoTitle,
      seoDescription,
      subscriptionPlan,

      // 🔒 System Controlled Fields
      status: "pending",
      isOpen: false,
      isBusy: false,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * @desc    Get All Restaurants
 * @route   GET /api/restaurants
 * @access  Private (Admin)
 */
export const getAllRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const filter = { isDeleted: false };

    if (status) filter.status = status;

    if (search) {
      filter.$text = { $search: search };
    }

    const restaurants = await Restaurant.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Restaurant.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET SINGLE RESTAURANT
========================================================= */
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant || restaurant.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   UPDATE RESTAURANT
========================================================= */
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.restaurantId,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   SOFT DELETE RESTAURANT
========================================================= */
export const deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndUpdate(req.params.restaurantId, {
      isDeleted: true,
    });

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   UPDATE STATUS (Admin Only)
========================================================= */
export const updateRestaurantStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.restaurantId,
      { status, rejectionReason },
      { new: true }
    );

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   TOGGLE OPEN
========================================================= */
export const toggleRestaurantOpen = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   TOGGLE BUSY
========================================================= */
export const toggleRestaurantBusy = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    restaurant.isBusy = !restaurant.isBusy;
    await restaurant.save();

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   CATEGORY MANAGEMENT
========================================================= */
export const addCategory = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    restaurant.categories.push(req.body);

    await restaurant.save();

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    const category = restaurant.categories.id(req.params.categoryId);
    Object.assign(category, req.body);

    await restaurant.save();

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    restaurant.categories.id(req.params.categoryId).remove();
    await restaurant.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   OFFER MANAGEMENT
========================================================= */
export const addOffer = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    restaurant.offers.push(req.body);
    await restaurant.save();

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    const offer = restaurant.offers.id(req.params.offerId);
    Object.assign(offer, req.body);

    await restaurant.save();

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    restaurant.offers.id(req.params.offerId).remove();
    await restaurant.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   UPDATE SUBSCRIPTION
========================================================= */
export const updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan, subscriptionExpiry } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.restaurantId,
      { subscriptionPlan, subscriptionExpiry },
      { new: true }
    );

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};