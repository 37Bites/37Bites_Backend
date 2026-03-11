// controllers/restaurantController.js
import Restaurant from "../models/Restaurant.js";

/* ================================
   GET RESTAURANT PROFILE
=================================*/
export const getProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user.id })
      .populate("approvedBy", "name email")
      .select("-__v -isDeleted -isBlocked");

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================================
   UPDATE RESTAURANT PROFILE
=================================*/
export const updateProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // Editable fields
    const editableFields = [
      "name",
      "slug",
      "description",
      "restaurantType",
      "cuisines",
      "serviceType",
      "averageCostForTwo",
      "profileImage",
      "coverImage",
      "galleryImages",
      "address",
      "timings",
      "autoAcceptOrders",
      "preparationTimeInMinutes",
      "deliveryTimeInMinutes",
      "deliveryRadiusInKm",
      "minimumOrderAmount",
      "packagingCharge",
      "paymentMethods",
      "canAddCategory",
      "categories",
      "offers",
      "socialLinks",
      "seoTitle",
      "seoDescription",
      "subscriptionPlan",
      "subscriptionExpiry",
      "ownerMobile"
    ];

    editableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    await restaurant.save();
    res.json({ success: true, message: "Profile updated", data: restaurant });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// controllers/restaurantController.js
export const getProfileCompletion = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // List of fields to check
    const fields = [
      "name",
      "description",
      "restaurantType",
      "cuisines",
      "serviceType",
      "averageCostForTwo",
      "profileImage.url",
      "coverImage.url",
      "galleryImages",
      "address.street",
      "address.city",
      "address.state",
      "address.pincode",
      "timings",
      "categories",
      "offers",
      "socialLinks.website",
      "socialLinks.instagram",
      "socialLinks.facebook",
      "seoTitle",
      "seoDescription"
    ];

    // Helper to get nested value
    const getNested = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : null), obj);

    // Count completed fields
    let completed = 0;
    fields.forEach((field) => {
      const value = getNested(restaurant, field);
      if (Array.isArray(value)) {
        if (value.length > 0) completed++;
      } else if (value !== null && value !== undefined && value !== "") {
        completed++;
      }
    });

    const completionPercentage = Math.round((completed / fields.length) * 100);

    res.json({
      success: true,
      data: {
        completionPercentage,
        completedFields: completed,
        totalFields: fields.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// /* ================================
//    GET TRACKER STATS
// =================================*/
// export const getTracker = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findOne({ user: req.user.id }).select(
//       "totalOrders activeOrders cancelledOrders totalRevenue totalCustomers averagePreparationTime orderAcceptanceRate cancellationRate"
//     );

//     if (!restaurant) {
//       return res.status(404).json({ success: false, message: "Restaurant not found" });
//     }

//     res.json({ success: true, data: restaurant });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };