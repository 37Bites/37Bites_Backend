import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One user = one restaurant
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    address: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);