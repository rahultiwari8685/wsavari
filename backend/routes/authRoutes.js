const express = require("express");

const router = express.Router();

router.post("/send-otp", (req, res) => {
  res.json({
    success: true,
    message: "OTP endpoint working",
  });
});

router.post("/verify-otp", (req, res) => {
  res.json({
    success: true,
    message: "OTP verification endpoint working",
  });
});

module.exports = router;
