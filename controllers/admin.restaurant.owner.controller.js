import express from "express";
import User from "../models/User.js";

export const getAllOwners = async (req, res, next) => {
  try {
    const users = await User.find({
      role: "restaurant",
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};