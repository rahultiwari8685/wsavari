import express from "express";

import {
  sendPartnerOtp,
  verifyPartnerOtp,
} from "../controllers/partnerAuthController.js";

const router = express.Router();

router.post("/send-otp", sendPartnerOtp);
router.post("/verify-otp", verifyPartnerOtp);

export default router;
