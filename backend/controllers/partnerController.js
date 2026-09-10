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

export const getPartnerStatus = async (req, res) => {
  try {
    const partner = await Partner.findById(req.user.partnerId).populate(
      "user",
      "name phone",
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    return res.json({
      success: true,

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
    console.error("Get partner status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get partner status",
    });
  }
};

export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find()
      .populate("user", "name phone role isActive isVerified")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      count: partners.length,

      partners: partners.map((partner) => ({
        _id: partner._id,

        user: partner.user,

        vehicleType: partner.vehicleType,

        vehicleNumber: partner.vehicleNumber,

        drivingLicense: partner.drivingLicense,

        status: partner.status,

        isOnline: partner.isOnline,

        currentLocation: partner.currentLocation,

        createdAt: partner.createdAt,

        updatedAt: partner.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get all partners error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get partners",
    });
  }
};

export const approvePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    if (partner.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Partner is already approved",
      });
    }

    partner.status = "APPROVED";

    await partner.save();

    return res.json({
      success: true,
      message: "Partner approved successfully",

      partner: {
        _id: partner._id,
        status: partner.status,
        isOnline: partner.isOnline,
        vehicleType: partner.vehicleType,
        vehicleNumber: partner.vehicleNumber,
      },
    });
  } catch (error) {
    console.error("Approve partner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve partner",
    });
  }
};

export const rejectPartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    partner.status = "REJECTED";

    // Make sure rejected partner cannot remain online
    partner.isOnline = false;

    await partner.save();

    return res.json({
      success: true,
      message: "Partner rejected successfully",

      partner: {
        _id: partner._id,
        status: partner.status,
        isOnline: partner.isOnline,
        vehicleType: partner.vehicleType,
        vehicleNumber: partner.vehicleNumber,
      },
    });
  } catch (error) {
    console.error("Reject partner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject partner",
    });
  }
};
