import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic Info
    name: { type: String, required: true },
    description: { type: String },

    image: {
      url: { type: String },
      publicId: { type: String },
    },

    address: { type: String, required: true },

    // Business Logic Fields
    status: {
      type: String,
      enum: ["active", "awaiting_approval", "blocked"],
      default: "awaiting_approval",
    },

    isOpen: {
      type: Boolean,
      default: false,
    },

    canAddCategory: {
      type: Boolean,
      default: true,
    },

    commissionPercentage: {
      type: Number,
      default: 10,
    },

    // Stats
    totalProducts: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    activeOrders: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);