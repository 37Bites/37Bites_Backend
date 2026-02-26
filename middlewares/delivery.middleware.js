export const deliveryOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "delivery") {
    return res.status(403).json({
      success: false,
      message: "Delivery access only",
    });
  }

  next();
};