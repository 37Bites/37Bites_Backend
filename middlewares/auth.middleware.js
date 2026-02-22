import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.token; // ✅ read from cookie

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
};