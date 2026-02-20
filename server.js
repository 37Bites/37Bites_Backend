import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server running successfully",
    environment: process.env.NODE_ENV,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});