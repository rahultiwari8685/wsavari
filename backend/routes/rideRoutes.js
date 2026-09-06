import express from "express";

import {
  createRide,
  getRide,
  cancelRide,
  getAvailableRides,
} from "../controllers/rideController.js";

const router = express.Router();

// IMPORTANT: static routes must come before /:id
router.get("/available", getAvailableRides);

router.post("/", createRide);

router.get("/:id", getRide);

router.put("/:id/cancel", cancelRide);

export default router;
