  import mongoose from "mongoose";

  const userSchema = new mongoose.Schema(
    {
      mobile: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["user", "restaurant","admin", "delivery"],
        required: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  // Unique combination of mobile + role
  userSchema.index({ mobile: 1, role: 1 }, { unique: true });

  export default mongoose.model("User", userSchema);