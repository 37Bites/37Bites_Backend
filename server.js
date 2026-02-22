import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
const app = express();


connectDB();



const allowedOrigins = [
  "http://localhost:5173",
  "https://37-bites-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res) => {
  res.json({
    message: "37 Bites API Running",
    environment: process.env.NODE_ENV,
  });
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/users", userRoutes);


app.use(errorHandler);


if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
}

export default app;