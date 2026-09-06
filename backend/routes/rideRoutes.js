import express from "express";

import {
  createRide,
  getRide,
  cancelRide,
} from "../controllers/rideController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRide);

router.get("/:id", protect, getRide);

router.put("/:id/cancel", protect, cancelRide);

export default router;
