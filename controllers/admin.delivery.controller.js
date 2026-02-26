import Delivery from "../models/Delivery.js";
import User from "../models/User.js";

/* ======================================
   ADMIN - CREATE DELIVERY MAN
====================================== */
export const adminCreateDelivery = async (req, res) => {
  try {
    const { userId, vehicleType, licenseNumber, phone, address } = req.body;

    const user = await User.findById(userId);

    if (!user || user.role !== "delivery") {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery user",
      });
    }

    const existing = await Delivery.findOne({ user: userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Delivery profile already exists",
      });
    }

    const delivery = await Delivery.create({
      user: userId,
      vehicleType,
      licenseNumber,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
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
   ADMIN - GET ALL DELIVERY MEN
====================================== */
export const adminGetAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("user", "name mobile email role");

    res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================
   ADMIN - GET SINGLE DELIVERY
====================================== */
export const adminGetDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("user", "name mobile email role");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
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
   ADMIN - UPDATE DELIVERY
====================================== */
export const adminUpdateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    const { vehicleType, licenseNumber, phone, address } = req.body;

    delivery.vehicleType = vehicleType ?? delivery.vehicleType;
    delivery.licenseNumber = licenseNumber ?? delivery.licenseNumber;
    delivery.phone = phone ?? delivery.phone;
    delivery.address = address ?? delivery.address;

    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Delivery updated successfully",
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
   ADMIN - DELETE DELIVERY
====================================== */
export const adminDeleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};