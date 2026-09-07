import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import Partner from "../models/Partner.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (user, partner) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      partnerId: partner._id.toString(),
      role: "partner",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

export const sendPartnerOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const cleanPhone = phone.trim();

    const otp = generateOtp();

    await Otp.deleteMany({
      phone: cleanPhone,
    });

    await Otp.create({
      phone: cleanPhone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log(`Partner OTP for ${cleanPhone}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send partner OTP error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyPartnerOtp = async (req, res) => {
  try {
    const { phone, otp, name, vehicleType, vehicleNumber, drivingLicense } =
      req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const cleanPhone = phone.trim();

    const otpRecord = await Otp.findOne({
      phone: cleanPhone,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(429).json({
        success: false,
        message: "Too many OTP attempts",
      });
    }

    if (otpRecord.otp !== String(otp).trim()) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Find or create user
    let user = await User.findOne({
      phone: cleanPhone,
    });

    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: name || "",
        role: "rider",
        isVerified: true,
        isActive: true,
      });
    } else {
      user.isVerified = true;

      if (name) {
        user.name = name;
      }

      await user.save();
    }

    // Find existing partner profile
    let partner = await Partner.findOne({
      user: user._id,
    });

    // Create partner profile for first-time partner
    if (!partner) {
      if (!name || !vehicleType || !vehicleNumber) {
        return res.status(400).json({
          success: false,
          message:
            "Name, vehicle type and vehicle number are required for partner registration",
        });
      }

      partner = await Partner.create({
        user: user._id,
        vehicleType,
        vehicleNumber,
        drivingLicense: drivingLicense || "",
        status: "PENDING",
        isOnline: false,
        currentLocation: {
          latitude: null,
          longitude: null,
        },
      });
    }

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    const token = generateToken(user, partner);

    return res.json({
      success: true,
      message:
        partner.status === "APPROVED"
          ? "Partner login successful"
          : "Partner registration successful. Waiting for approval.",
      token,
      partner: {
        _id: partner._id,
        user: partner.user,
        vehicleType: partner.vehicleType,
        vehicleNumber: partner.vehicleNumber,
        drivingLicense: partner.drivingLicense,
        status: partner.status,
        isOnline: partner.isOnline,
        currentLocation: partner.currentLocation,
      },
    });
  } catch (error) {
    console.error("Verify partner OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify partner OTP",
    });
  }
};
