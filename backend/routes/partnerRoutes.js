import express from "express";

import {
  getPartnerStatus,
  updatePartnerStatus,
  getAllPartners,
  approvePartner,
  rejectPartner,
} from "../controllers/partnerController.js";

import { partnerAuth } from "../middleware/partnerAuth.js";

const router = express.Router();

router.get("/status", partnerAuth, getPartnerStatus);

router.put("/status", partnerAuth, updatePartnerStatus);

router.get("/admin/all", getAllPartners);

router.put("/admin/:id/approve", approvePartner);

router.put("/admin/:id/reject", rejectPartner);

export default router;
