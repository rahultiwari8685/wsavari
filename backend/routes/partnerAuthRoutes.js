import express from "express";

import {
  sendPartnerOtp,
  verifyPartnerOtp,
  registerPartner,
} from "../controllers/partnerAuthController.js";

const router = express.Router();

router.post("/send-otp", sendPartnerOtp);
router.post("/verify-otp", verifyPartnerOtp);
router.post("/register", registerPartner);

export default router;
