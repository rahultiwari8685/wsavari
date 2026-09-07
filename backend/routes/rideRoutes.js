import express from "express";

import {
  createRide,
  getRide,
  cancelRide,
  getAvailableRides,
  acceptRide,
  startRide,
  completeRide,
} from "../controllers/rideController.js";

import { auth } from "../middleware/authMiddleware.js";
import { partnerAuth } from "../middleware/partnerAuth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CUSTOMER
|--------------------------------------------------------------------------
*/

// Create ride
router.post("/", auth, createRide);

// Cancel ride
router.put("/:id/cancel", auth, cancelRide);

/*
|--------------------------------------------------------------------------
| PARTNER
|--------------------------------------------------------------------------
*/

// Available rides
router.get("/available", partnerAuth, getAvailableRides);

// Accept ride
router.post("/:id/accept", partnerAuth, acceptRide);

// Start ride
router.post("/:id/start", partnerAuth, startRide);

// Complete ride
router.post("/:id/complete", partnerAuth, completeRide);

/*
|--------------------------------------------------------------------------
| COMMON
|--------------------------------------------------------------------------
*/

// Get single ride
router.get("/:id", auth, getRide);

export default router;
