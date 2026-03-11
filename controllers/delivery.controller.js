import Delivery from "../models/Delivery.js";

/* ===============================
   GET DELIVERY PROFILE
================================= */
export const getDeliveryProfile = async (req, res) => {
  try {
    let delivery = await Delivery.findOne({ user: req.user.id });

    // Auto-create if missing
    if (!delivery) {
      delivery = await Delivery.create({
        user: req.user.id,
        name: req.user.data.name || "",
        phone: req.user.data.mobile || "",
        vehicleType: "",
        vehicleNumber: "",
        licenseNumber: "",
        address: "",
        isAvailable: true,
        currentLocation: { type: "Point", coordinates: [0, 0] },
        rating: 0,
        totalDeliveries: 0,
        isVerified: req.user.data.isVerified || false,
      });
    }

    res.json({ success: true, data: delivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   UPDATE DELIVERY PROFILE
================================= */
export const updateDeliveryProfile = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ user: req.user.id });
    if (!delivery) return res.status(404).json({ success: false, message: "Delivery account not found" });

    const fields = [
      "name",
      "vehicleType",
      "vehicleNumber",
      "licenseNumber",
      "phone",
      "address",
      "isAvailable",
      "currentLocation",
      "rating"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) delivery[field] = req.body[field];
    });

    await delivery.save();
    res.json({ success: true, message: "Profile updated", data: delivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   DELIVERY PROFILE COMPLETION
================================= */
export const getDeliveryProfileCompletion = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ user: req.user.id });
    if (!delivery) return res.status(404).json({ success: false, message: "Delivery account not found" });

    const fields = [
      "name",
      "vehicleType",
      "vehicleNumber",
      "licenseNumber",
      "phone",
      "address",
      "currentLocation.coordinates"
    ];

    const getNested = (obj, path) =>
      path === "currentLocation.coordinates"
        ? obj.currentLocation?.coordinates
        : path.split(".").reduce((o, k) => (o ? o[k] : null), obj);

    let completed = 0;
    fields.forEach(f => {
      const val = getNested(delivery, f);
      if (Array.isArray(val)) {
        if (val.length > 0) completed++;
      } else if (val !== null && val !== undefined && val !== "") {
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