import User from "../models/User.js";

/* ==========================================
   CREATE USER
========================================== */
export const createUser = async (req, res, next) => {
  try {
    const {
      mobile,
      role,
      name,
      gender,
      profilePhoto,
      isVerified,
      isActive,
      lastLoginAt,
      addresses,
      preferences,
      ownedRestaurants,
    } = req.body;

    if (!mobile || !role || !name) {
      return res.status(400).json({
        success: false,
        message: "Mobile, role and name are required",
      });
    }

    // Unique mobile + role check
    const existingUser = await User.findOne({ mobile, role });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this role",
      });
    }

    const user = await User.create({
      mobile,
      role,
      name,
      gender,
      profilePhoto,
      isVerified,
      isActive,
      lastLoginAt,
      addresses,
      preferences,
      ownedRestaurants,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET ALL USERS (Non Deleted Only)
========================================== */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      role: "user",
      
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET SINGLE USER
========================================== */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
      
    }).populate("ownedRestaurants");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   UPDATE USER
========================================== */
export const updateUser = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      profilePhoto,
      isVerified,
      isActive,
      lastLoginAt,
      addresses,
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalSpent,
      lastOrderAt,
      walletBalance,
      cashbackBalance,
      preferences,
      ownedRestaurants,
    } = req.body;

    const updates = {
      name,
      gender,
      profilePhoto,
      isVerified,
      isActive,
      lastLoginAt,
      addresses,
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalSpent,
      lastOrderAt,
      walletBalance,
      cashbackBalance,
      preferences,
      ownedRestaurants,
    };

    // Remove undefined fields
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   SOFT DELETE USER
========================================== */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully (soft delete)",
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   TOGGLE USER ACTIVE STATUS
========================================== */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        id: user._id,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};