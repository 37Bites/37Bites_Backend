import Delivery from "../models/Delivery.js";

/* ======================================
   CREATE DELIVERY PROFILE
====================================== */
export const createDeliveryProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingProfile = await Delivery.findOne({ user: userId });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Delivery profile already exists",
      });
    }

    const { name, vehicleType, licenseNumber, phone, address } = req.body;

    const delivery = await Delivery.create({
      user: userId,
      name,
      vehicleType,
      licenseNumber,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Delivery profile created successfully",
      delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   GET MY DELIVERY PROFILE
====================================== */
export const getMyDeliveryProfile = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ user: req.user.id })
      .populate("user", " mobile role");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery profile not found",
      });
    }

    res.status(200).json({
      success: true,
      delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   UPDATE DELIVERY PROFILE
====================================== */
export const updateDeliveryProfile = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ user: req.user.id });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery profile not found",
      });
    }

    const { name, vehicleType, licenseNumber, phone, address } = req.body;

    delivery.name = name || delivery.name;
    delivery.vehicleType = vehicleType || delivery.vehicleType;
    delivery.licenseNumber = licenseNumber || delivery.licenseNumber;
    delivery.phone = phone || delivery.phone;
    delivery.address = address || delivery.address;

    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


