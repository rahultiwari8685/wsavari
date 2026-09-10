import express from "express";

import {
  createRide,
  getRide,
  cancelRide,
  getAvailableRides,
  acceptRide,
  markRideArriving,
  startRide,
  completeRide,
} from "../controllers/rideController.js";

import { protect } from "../middleware/authMiddleware.js";

import { partnerAuth } from "../middleware/partnerAuth.js";

const router = express.Router();

// CUSTOMER

router.post("/", protect, createRide);

router.put("/:id/cancel", protect, cancelRide);

router.get("/:id", protect, getRide);

// PARTNER

router.get("/available", partnerAuth, getAvailableRides);

router.post("/:id/accept", partnerAuth, acceptRide);

router.post("/:id/arriving", partnerAuth, markRideArriving);

router.post("/:id/start", partnerAuth, startRide);

router.post("/:id/complete", partnerAuth, completeRide);

export default router;
