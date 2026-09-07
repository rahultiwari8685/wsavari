import express from "express";
import { updatePartnerStatus } from "../controllers/partnerController.js";
import { partnerAuth } from "../middleware/partnerAuth.js";

const router = express.Router();

router.put("/status", partnerAuth, updatePartnerStatus);

export default router;
