import mongoose from "mongoose";

/* ===============================
   CATEGORY SCHEMA
=================================*/
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: {
      url: String,
      publicId: String,
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ===============================
   ADDRESS SCHEMA (FULL GEO READY)
=================================*/
const addressSchema = new mongoose.Schema(
  {
    // flatNo: String,
    // buildingName: String,
    street: { type: String, required: true },
    area: { type: String, required: true },
    landmark: String,
    city: { type: String, required: true },
    
    state: { type: String, required: true },
    country: { type: String, default: "India" },
    pincode: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { _id: false }
);

/* ===============================
   DAILY TIMINGS
=================================*/
const timingSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    openTime: String,
    closeTime: String,
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

/* ===============================
   RESTAURANT MAIN SCHEMA
=================================*/
const restaurantSchema = new mongoose.Schema(
  {
    /* ==================================
       OWNER INFORMATION
    ===================================*/
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ==================================
       BASIC INFO
    ===================================*/
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: String,

    restaurantType: {
      type: String,
      enum: ["veg", "non-veg", "pure-veg", "both"],
      default: "both",
    },

    cuisines: [String], // ["North Indian", "Chinese", "Italian"]

    serviceType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery", "all"],
      default: "all",
    },

    averageCostForTwo: Number,

    /* ==================================
       MEDIA
    ===================================*/
    profileImage: {
      url: String,
      publicId: String,
    },

    coverImage: {
      url: String,
      publicId: String,
    },

    galleryImages: [
      {
        url: String,
        publicId: String,
      },
    ],

    /* ==================================
       ADDRESS
    ===================================*/
    address: addressSchema,

    /* ==================================
       OPERATIONS
    ===================================*/
    timings: [timingSchema],

    autoAcceptOrders: { type: Boolean, default: false },

    preparationTimeInMinutes: {
      type: Number,
      default: 20,
    },

    deliveryTimeInMinutes: {
      type: Number,
      default: 30,
    },

    deliveryRadiusInKm: {
      type: Number,
      default: 5,
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
    },

    packagingCharge: {
      type: Number,
      default: 0,
    },

    /* ==================================
       PAYMENT & TAX
    ===================================*/
    paymentMethods: {
      // cashOnDelivery: { type: Boolean, default: true },
      onlinePayment: { type: Boolean, default: true },
    },

   

    /* ==================================
       CATEGORY CONTROL
    ===================================*/
    canAddCategory: { type: Boolean, default: true },
    categories: [categorySchema],

    /* ==================================
       OFFERS
    ===================================*/
    offers: [
      {
        title: String,
        description: String,
        discountPercentage: Number,
        minOrderAmount: Number,
        validFrom: Date,
        validTill: Date,
        isActive: { type: Boolean, default: true },
      },
    ],

    /* ==================================
       RATINGS & REVIEWS
    ===================================*/
    ratings: {
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
     
    },

    /* ==================================
       BUSINESS STATUS
    ===================================*/
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "suspended"],
      default: "pending",
    },

    isOpen: { type: Boolean, default: false },
    isBusy: { type: Boolean, default: false },

    isFeatured: { type: Boolean, default: false },
   

    commissionPercentage: { type: Number, default: 10 },

    /* ==================================
       FINANCIAL TRACKING
    ===================================*/
    totalOrders: { type: Number, default: 0 },
    activeOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },

    payoutBalance: { type: Number, default: 0 },

    /* ==================================
       PERFORMANCE METRICS
    ===================================*/
    averagePreparationTime: { type: Number, default: 0 },
    orderAcceptanceRate: { type: Number, default: 100 },
    cancellationRate: { type: Number, default: 0 },

    /* ==================================
       SOCIAL & SEO
    ===================================*/
    socialLinks: {
      website: String,
      instagram: String,
      facebook: String,
      youtube: String,
    },

    seoTitle: String,
    seoDescription: String,

    /* ==================================
       ADMIN CONTROL
    ===================================*/
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    rejectionReason: String,
    adminNotes: String,

    /* ==================================
       SUBSCRIPTION PLAN
    ===================================*/
    subscriptionPlan: {
      type: String,
      enum: ["free", "silver", "gold", "platinum"],
      default: "free",
    },

    subscriptionExpiry: Date,

    /* ==================================
       SECURITY & FLAGS
    ===================================*/
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    lastActiveAt: Date,
  },
  { timestamps: true }
);

/* ===============================
   INDEXES
=================================*/
restaurantSchema.index({ "address.location": "2dsphere" });
restaurantSchema.index({ name: "text", description: "text", cuisines: "text" });

export default mongoose.model("Restaurant", restaurantSchema);