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
    licenseNumber: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },// vehicle number, is available, current location, ratings, total deliveries, etc can be added later as needed
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);