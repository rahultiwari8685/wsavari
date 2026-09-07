import Partner from "../models/Partner.js";

export const updatePartnerStatus = async (req, res) => {
  try {
    const { isOnline, latitude, longitude } = req.body;

    if (typeof isOnline !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isOnline must be true or false",
      });
    }

    const partner = await Partner.findById(req.partner._id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner account not found",
      });
    }

    if (partner.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Partner is not approved",
      });
    }

    partner.isOnline = isOnline;

    if (typeof latitude === "number" && typeof longitude === "number") {
      partner.currentLocation = {
        latitude,
        longitude,
      };
    }

    await partner.save();

    return res.json({
      success: true,
      message: isOnline ? "Partner is now online" : "Partner is now offline",
      partner: {
        _id: partner._id,
        vehicleType: partner.vehicleType,
        vehicleNumber: partner.vehicleNumber,
        status: partner.status,
        isOnline: partner.isOnline,
        currentLocation: partner.currentLocation,
      },
    });
  } catch (error) {
    console.error("Update partner status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update partner status",
    });
  }
};
