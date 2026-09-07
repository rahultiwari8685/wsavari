import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import partnerAuthRoutes from "./routes/partnerAuthRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/rides", rideRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Women Savari API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Women Savari backend is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/partner/auth", partnerAuthRoutes);
app.use("/api/partner", partnerRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
