import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/* ===============================
   DATABASE CONNECTION
================================= */
connectDB();

/* ===============================
   CORS CONFIGURATION
================================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://37-bites-frontend.vercel.app",
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman & server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ===============================
   MIDDLEWARES
================================= */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   HEALTH CHECK ROUTE
================================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 37 Bites API Running",
    environment: process.env.NODE_ENV,
  });
});

/* ===============================
   ROUTES (Versioned API)
================================= */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/admin", adminRoutes);

/* ===============================
   ERROR HANDLER (ALWAYS LAST)
================================= */
app.use(errorHandler);

/* ===============================
   SERVER LISTEN (Not for Vercel)
================================= */
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
}

export default app;