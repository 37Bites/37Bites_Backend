import mongoose from "mongoose";

/* ================= ADDRESS SCHEMA ================= */
const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    fullAddress: {
      type: String,
      required: true,
    },

    landmark: String,

    state: String,

    country: {
      type: String,
      default: "India",
    },

    pincode: String,

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

/* ================= USER SCHEMA ================= */
const userSchema = new mongoose.Schema(
  {
    /* ===== AUTH ===== */
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "restaurant", "admin", "delivery"],
      default: "user",
      index: true,
    },

    /* ===== PROFILE ===== */
    name: {
      type: String,
      
    },

    profilePhoto: {
      url: String,
      publicId: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    /* ===== STATUS ===== */
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: Date,

    /* ===== RESTAURANT LINKING ===== */
    ownedRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],

    /* ===== ADDRESSES ===== */
    addresses: [addressSchema],

    /* ===== ORDER STATS ===== */
    totalOrders: {
      type: Number,
      default: 0,
    },

    completedOrders: {
      type: Number,
      default: 0,
    },

    cancelledOrders: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    lastOrderAt: Date,

    /* ===== WALLET ===== */
    walletBalance: {
      type: Number,
      default: 0,
    },

    cashbackBalance: {
      type: Number,
      default: 0,
    },

    /* ===== PREFERENCES ===== */
    preferences: {
      language: {
        type: String,
        default: "en",
      },

      dietaryPreference: {
        type: String,
        enum: ["veg", "non-veg", "both"],
        default: "both",
      },
    },
  },
  { timestamps: true }
);
 userSchema.index({ mobile: 1, role: 1 }, { unique: true });

/* ================= INDEXES ================= */
userSchema.index({ "addresses.location": "2dsphere" });

export default mongoose.model("User", userSchema);




// import mongoose from "mongoose";

// /* ==========================================
//    ADDRESS SUB SCHEMA (SIMPLIFIED)
// ========================================== */
// const addressSchema = new mongoose.Schema(
//   {
    

//     // fullName: String,
//     // phone: String,

//     // Full address in one field (Flat + Building + Floor + City etc.)
//     fullAddress: {
//       type: String,
//       required: true,
//     },

//     landmark: String,
//     state: { type: String, required: true },
//     country: { type: String, default: "India" },
//     pincode: { type: String, required: true },

//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//       },
//     },

//     isDefault: { type: Boolean, default: false },
//   },
//   { _id: false }
// );

// /* ==========================================
//    USER MAIN SCHEMA
// ========================================== */
// const userSchema = new mongoose.Schema(
//   {
//     /* ============================
//        BASIC AUTH
//     ============================ */
//     mobile: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     role: {
//       type: String,
//       enum: ["user", "restaurant", "admin", "delivery"],
//       required: true,
//     },

//     refreshToken: String,

//     /* ============================
//        PROFILE
//     ============================ */
//     name: { type: String, trim: true },

//     profilePhoto: {
//       url: String,
//       publicId: String,
//     },

//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//     },

//     dateOfBirth: Date,
//     bio: String,

//     isVerified: { type: Boolean, default: false },
//     isActive: { type: Boolean, default: true },
//     lastLoginAt: Date,

 
//     addresses: [addressSchema],


//     totalOrders: { type: Number, default: 0 },
//     completedOrders: { type: Number, default: 0 },
//     cancelledOrders: { type: Number, default: 0 },

//     totalSpent: { type: Number, default: 0 },     // for users
   

//     lastOrderAt: Date,

   
//     walletBalance: { type: Number, default: 0 },
//     // loyaltyPoints: { type: Number, default: 0 },
//     cashbackBalance: { type: Number, default: 0 },

//     // referralCode: { type: String, unique: true, sparse: true },
//     // referredBy: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "User",
//     // },
//     // totalReferrals: { type: Number, default: 0 },

//     preferences: {
//       language: { type: String, default: "en" },

//       dietaryPreference: {
//         type: String,
//         enum: ["veg", "non-veg", "both"],
//         default: "both",
//       },

//       // notificationPreferences: {
//       //   push: { type: Boolean, default: true },
//       //   sms: { type: Boolean, default: true },
//       // },
//     },
//     restaurant: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Restaurant",
//   default: null,
// },

   
//   },
//   { timestamps: true }
// );

// /* ==========================================
//    INDEXES
// ========================================== */

// // Unique mobile + role
// userSchema.index({ mobile: 1, role: 1 }, { unique: true });

// // Geo index
// userSchema.index({ "addresses.location": "2dsphere" });

// export default mongoose.model("User", userSchema);