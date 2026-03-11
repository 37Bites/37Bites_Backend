import User from "../models/User.js";

/* ===============================
   GET USER PROFILE
================================= */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-refreshToken");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   UPDATE USER PROFILE
================================= */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const fields = [
      "name",
      "profilePhoto",
      "gender",
      "dateOfBirth",
      "bio",
      "addresses",
      "preferences.language",
      "preferences.dietaryPreference"
    ];

    fields.forEach(field => {
      const keys = field.split(".");
      if (keys.length === 1 && req.body[field] !== undefined) {
        user[field] = req.body[field];
      } else if (keys.length === 2 && req.body[keys[0]]?.[keys[1]] !== undefined) {
        user[keys[0]][keys[1]] = req.body[keys[0]][keys[1]];
      }
    });

    await user.save();
    res.json({ success: true, message: "Profile updated", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===============================
   USER PROFILE COMPLETION
================================= */
export const getUserProfileCompletion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const fields = [
      "name",
      "profilePhoto.url",
      "gender",
      "dateOfBirth",
      "bio",
      "addresses.length",
      "preferences.language",
      "preferences.dietaryPreference"
    ];

    const getNested = (obj, path) =>
      path === "addresses.length"
        ? obj.addresses?.length
        : path.split(".").reduce((o, k) => (o ? o[k] : null), obj);

    let completed = 0;
    fields.forEach(f => {
      const val = getNested(user, f);
      if (Array.isArray(val)) {
        if (val.length > 0) completed++;
      } else if (val !== null && val !== undefined && val !== "") {
        completed++;
      }
    });

    const completionPercentage = Math.round((completed / fields.length) * 100);
    res.json({ success: true, data: { completionPercentage, completedFields: completed, totalFields: fields.length } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};