import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import Partner from "../models/Partner.js";
import axios from "axios";

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

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // DEVELOPMENT ONLY
    const otp = "123456";

    // Remove previous OTP
    await Otp.deleteMany({
      phone: cleanPhone,
    });

    // Save new OTP
    await Otp.create({
      phone: cleanPhone,
      otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log(`DEV Partner OTP for ${cleanPhone}: ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      devOtp: otp,
    });
  } catch (error) {
    console.error(
      "Send partner OTP error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
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

    const cleanPhone = phone.replace(/\D/g, "");
    const enteredOtp = String(otp).trim();

    // ==========================================
    // DEVELOPMENT OTP
    // ==========================================
    const DEV_OTP = "123456";

    if (enteredOtp !== DEV_OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    console.log(`DEV OTP verified for partner: ${cleanPhone}`);

    // ==========================================
    // FIND OR CREATE USER
    // ==========================================
    let user = await User.findOne({
      phone: cleanPhone,
    });

    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: name || "",
        role: "customer",
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

    // ==========================================
    // FIND EXISTING PARTNER
    // ==========================================
    let partner = await Partner.findOne({
      user: user._id,
    });

    // ==========================================
    // CREATE PARTNER FOR FIRST TIME
    // ==========================================
    if (!partner) {
      return res.json({
        success: true,
        requiresRegistration: true,
        message: "OTP verified. Please complete partner registration.",
      });
    }

    // ==========================================
    // GENERATE JWT
    // ==========================================
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

export const registerPartner = async (req, res) => {
  try {
    const { phone, otp, name, vehicleType, vehicleNumber, drivingLicense } =
      req.body;

    if (!phone || !otp || !name || !vehicleType || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: "Name, vehicle type and vehicle number are required",
      });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const cleanName = String(name).trim();
    const cleanVehicleType = String(vehicleType).trim().toLowerCase();

    const allowedVehicleTypes = ["bike", "scooter", "auto", "car"];

    if (!allowedVehicleTypes.includes(cleanVehicleType)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid vehicle type. Allowed values: bike, scooter, auto, car",
      });
    }
    const cleanVehicleNumber = String(vehicleNumber).trim().toUpperCase();

    const cleanDrivingLicense = drivingLicense
      ? String(drivingLicense).trim().toUpperCase()
      : "";

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!cleanVehicleType) {
      return res.status(400).json({
        success: false,
        message: "Vehicle type is required",
      });
    }

    if (!cleanVehicleNumber) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number is required",
      });
    }

    if (String(otp).trim() !== "123456") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    let user = await User.findOne({
      phone: cleanPhone,
    });

    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: cleanName,
        role: "customer",
        isVerified: true,
        isActive: true,
      });
    } else {
      // User exists
      user.name = cleanName;
      user.isVerified = true;

      await user.save();
    }

    // --------------------------------------------
    // 7. CHECK EXISTING PARTNER
    // --------------------------------------------
    let partner = await Partner.findOne({
      user: user._id,
    });

    if (partner) {
      return res.status(400).json({
        success: false,
        message: "Partner account already exists",
      });
    }

    // --------------------------------------------
    // 8. CREATE PARTNER PROFILE
    // --------------------------------------------
    partner = await Partner.create({
      user: user._id,

      vehicleType: cleanVehicleType,

      vehicleNumber: cleanVehicleNumber,

      drivingLicense: cleanDrivingLicense,

      status: "PENDING",

      isOnline: false,

      currentLocation: {
        latitude: null,
        longitude: null,
      },
    });

    // --------------------------------------------
    // 9. DELETE OTP RECORD
    // --------------------------------------------
    await Otp.deleteMany({
      phone: cleanPhone,
    });

    // --------------------------------------------
    // 10. GENERATE LOGIN TOKEN
    // --------------------------------------------
    const token = generateToken(user, partner);

    // --------------------------------------------
    // 11. RESPONSE
    // --------------------------------------------
    return res.status(201).json({
      success: true,

      message: "Partner registration successful. Waiting for approval.",

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
    console.error("=================================");
    console.error("REGISTER PARTNER ERROR");
    console.error("=================================");

    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);

    if (error.errors) {
      console.error("MONGOOSE VALIDATION ERRORS:");

      Object.keys(error.errors).forEach((key) => {
        console.error(key, "=>", error.errors[key].message);
      });
    }

    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register partner",
    });
  }
};
