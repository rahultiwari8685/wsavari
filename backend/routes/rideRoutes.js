import express from "express";
import {
  createRide,
  getRide,
  cancelRide,
} from "../controllers/rideController.js";

const router = express.Router();

router.post("/", createRide);

router.get("/:id", getRide);

router.put("/:id/cancel", cancelRide);

export default router;
