import express from "express";

import {
  createRide,
  getRide,
  cancelRide,
  getAvailableRides,
} from "../controllers/rideController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRide);

router.get("/:id", protect, getRide);

router.put("/:id/cancel", protect, cancelRide);
router.get("/available", getAvailableRides);
export default router;
