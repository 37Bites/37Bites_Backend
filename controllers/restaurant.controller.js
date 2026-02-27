import Restaurant from "../models/restaurant.model.js";
import User from "../models/User.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";

/**
 * @desc    Create Restaurant (Admin)
 * @route   POST /api/restaurants
 * @access  Private (Admin)
 */
export const createRestaurant = async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      address,
      commissionPercentage,
      canAddCategory,
    } = req.body;
    console.log("BODY:", req.body);
console.log("USER ID:", req.body.userId);

    const user = await User.findById(userId);

    if (!user || user.role !== "restaurant") {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant user",
      });
    }

    const existing = await Restaurant.findOne({ user: userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Restaurant profile already exists for this user",
      });
    }

    // ✅ NEW IMAGE UPLOAD LOGIC
    let imageData = {};

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "swiggy-clone/restaurants/logos"
      );

      imageData = {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      };
    }

    const restaurant = await Restaurant.create({
      user: userId,
      name,
      description,
      address,
      commissionPercentage: commissionPercentage || 10,
      canAddCategory: canAddCategory ?? true,
      ...imageData,
    });

    res.status(201).json({
      success: true,
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
    const restaurants = await Restaurant.find()
      .populate("user", "mobile role");

    const formattedData = restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      image: r.image?.url,
      address: r.address,
      status: r.status,
      isOpen: r.isOpen,
      canAddCategory: r.canAddCategory,
      commissionPercentage: r.commissionPercentage,
      totalProducts: r.totalProducts,
      totalOrders: r.totalOrders,
      activeOrders: r.activeOrders,
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * @desc    Get Restaurant By ID
 * @route   GET /api/restaurants/:id
 * @access  Private (Admin)
 */
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "user",
      "name mobile email role"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
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
 * @desc    Update Restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private (Admin)
 */
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name mobile email role");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
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
 * @desc    Delete Restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Private (Admin)
 */
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // ✅ Delete image from Cloudinary
    if (restaurant.image?.publicId) {
      await deleteFromCloudinary(restaurant.image.publicId);
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.status = status;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleRestaurantOpen = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant status toggled",
      isOpen: restaurant.isOpen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};