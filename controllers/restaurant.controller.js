import Restaurant from "../models/restaurant.model.js";
import User from "../models/User.js";

/**
 * @desc    Create Restaurant (Admin)
 * @route   POST /api/restaurants
 * @access  Private (Admin)
 */
export const createRestaurant = async (req, res) => {
  try {
    const { userId, name, description, address, image } = req.body;

    // Check if user exists and is restaurant role
    const user = await User.findById(userId);

    if (!user || user.role !== "restaurant") {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant user",
      });
    }

    // Check if restaurant profile already exists
    const existing = await Restaurant.findOne({ user: userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Restaurant profile already exists for this user",
      });
    }

    const restaurant = await Restaurant.create({
      user: userId,
      name: name || "",
      description: description || "",
      address: address || "",
      image: image || "",
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
    const restaurants = await Restaurant.find().populate(
      "user",
      "name mobile email role"
    );

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
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
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

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