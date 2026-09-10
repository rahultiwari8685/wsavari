import express from "express";
import {
  updatePartnerStatus,
  getPartnerStatus,
} from "../controllers/partnerController.js";
import { partnerAuth } from "../middleware/partnerAuth.js";

const router = express.Router();

router.put("/status", partnerAuth, updatePartnerStatus);
router.get("/status", partnerAuth, getPartnerStatus);
export default router;
