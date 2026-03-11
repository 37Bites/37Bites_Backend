import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    mobile: {
      type: String,
      default: ""
    },

    profileImage: {
      url: {
        type: String,
        default: ""
      }
    },

    address: {
      fullAddress: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      landmark: String,

      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: true
    },

    isEmailVerified: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);