import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";



import slugify from "slugify";

/* =========================================================
   CREATE RESTAURANT (ADMIN)
========================================================= */
export const createRestaurant = async (req, res) => {
  try {
    /* =========================================================
       🔥 STEP 1: PARSE JSON FIELDS (VERY IMPORTANT)
    ========================================================= */
    const jsonFields = [
      "address",
      "timings",
      "paymentMethods",
      "socialLinks",
      "cuisines",
      "categories",
      "offers",
    ];

    jsonFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `Invalid JSON format in ${field}`,
          });
        }
      }
    });

    /* =========================================================
       STEP 2: DESTRUCTURE
    ========================================================= */
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
      ownerMobile,
      ownerName,
    } = req.body;

    /* =========================================================
       STEP 3: BASIC VALIDATION
    ========================================================= */

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Restaurant name is required",
      });
    }

    if (!ownerMobile?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Owner mobile number is required",
      });
    }

    if (
      !address ||
      !address.fullAddress ||
      !address.state ||
      !address.pincode ||
      !address.location ||
      !Array.isArray(address.location.coordinates) ||
      address.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid address with coordinates is required",
      });
    }

    // Ensure coordinates are numbers
    const [longitude, latitude] = address.location.coordinates;

    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    /* =========================================================
       STEP 4: CREATE OR UPDATE OWNER USER
    ========================================================= */
    let owner = await User.findOne({ mobile: ownerMobile.trim() });

    if (!owner) {
      owner = await User.create({
        name: ownerName?.trim() || "",
        mobile: ownerMobile.trim(),
        role: "restaurant",
        isVerified: true,
      });
    } else {
      owner.role = "restaurant";
      owner.isVerified = true;
      if (ownerName) owner.name = ownerName.trim();
      await owner.save();
    }

    /* =========================================================
       STEP 5: CHECK IF OWNER ALREADY HAS RESTAURANT
    ========================================================= */
    const existingRestaurant = await Restaurant.findOne({
      user: owner._id,
      isDeleted: false,
    });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "This owner already has a restaurant",
      });
    }

    /* =========================================================
       STEP 6: GENERATE UNIQUE SLUG
    ========================================================= */
    let slug = slugify(name, { lower: true, strict: true });

    const slugExists = await Restaurant.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    /* =========================================================
       STEP 7: CREATE RESTAURANT
    ========================================================= */
    const restaurant = await Restaurant.create({
      user: owner._id,

      name: name.trim(),
      slug,
      description,
      restaurantType,
      cuisines,
      serviceType,
      averageCostForTwo,

      address: {
        fullAddress: address.fullAddress,
        landmark: address.landmark,
        state: address.state,
        country: address.country || "India",
        pincode: address.pincode,
        location: {
          type: "Point",
          coordinates: [longitude, latitude], // MUST BE [lng, lat]
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

      status: "pending",
      isOpen: false,
      isBusy: false,
    });

    /* =========================================================
       STEP 8: LINK RESTAURANT TO OWNER
    ========================================================= */
    owner.restaurant = restaurant._id;
    await owner.save();

    /* =========================================================
       SUCCESS RESPONSE
    ========================================================= */
    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully and owner assigned",
      data: restaurant,
    });

  } catch (error) {
    console.error("Create Restaurant Error:", error);

    return res.status(500).json({
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