import jwt from "jsonwebtoken";
import Partner from "../models/Partner.js";

export const partnerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "partner") {
      return res.status(403).json({
        success: false,
        message: "Partner access required",
      });
    }

    const partner = await Partner.findById(decoded.partnerId).populate(
      "user",
      "name phone role isActive isVerified",
    );

    if (!partner) {
      return res.status(401).json({
        success: false,
        message: "Partner account not found",
      });
    }

    if (!partner.user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Partner account is inactive",
      });
    }

    req.partner = partner;
    req.user = partner.user;

    next();
  } catch (error) {
    console.error("Partner auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
