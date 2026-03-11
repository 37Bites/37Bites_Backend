import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
    },
    vehicleNumber: { // added field
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    isAvailable: { // added field
      type: Boolean,
      default: true,
    },
    currentLocation: { // added field (GeoJSON)
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { // [longitude, latitude]
        type: [Number],
        default: [0, 0],
      },
    },
    rating: { // added field
      type: Number,
      default: 0,
    },
    totalDeliveries: { // added field
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// optional: add 2dsphere index for geo queries
deliverySchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("Delivery", deliverySchema);