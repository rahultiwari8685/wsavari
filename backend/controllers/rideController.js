import Ride from "../models/Ride.js";

export const createRide = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create rides",
      });
    }

    const { pickup, destination, vehicleType, estimatedFare } = req.body;

    if (!pickup || !destination || !vehicleType || estimatedFare == null) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup, destination, vehicle type and estimated fare are required",
      });
    }

    const ride = await Ride.create({
      customer: req.user._id,
      pickup,
      destination,
      vehicleType,
      estimatedFare,
      partner: null,
      status: "SEARCHING",
    });

    return res.status(201).json({
      success: true,
      message: "Ride request created",
      ride,
    });
  } catch (error) {
    console.error("Create ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create ride",
    });
  }
};

export const getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("customer", "name phone profilePhoto")
      .populate({
        path: "partner",
        populate: {
          path: "user",
          select: "name phone profilePhoto",
        },
      });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    return res.json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error("Get ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get ride",
    });
  }
};

export const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel this ride",
      });
    }

    if (ride.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed ride cannot be cancelled",
      });
    }

    if (ride.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Ride is already cancelled",
      });
    }

    ride.status = "CANCELLED";

    await ride.save();

    return res.json({
      success: true,
      message: "Ride cancelled",
      ride,
    });
  } catch (error) {
    console.error("Cancel ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel ride",
    });
  }
};

export const getAvailableRides = async (req, res) => {
  try {
    if (req.partner.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Partner account is not approved",
      });
    }

    if (!req.partner.isOnline) {
      return res.status(400).json({
        success: false,
        message: "Partner is offline",
      });
    }

    const rides = await Ride.find({
      status: "SEARCHING",
      partner: null,
      vehicleType: req.partner.vehicleType,
    })
      .populate("customer", "name phone profilePhoto")
      .sort({ requestedAt: -1 });

    return res.json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Get available rides error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get available rides",
    });
  }
};

export const acceptRide = async (req, res) => {
  try {
    if (req.partner.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Partner account is not approved",
      });
    }

    if (!req.partner.isOnline) {
      return res.status(400).json({
        success: false,
        message: "Partner is offline",
      });
    }

    const ride = await Ride.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "SEARCHING",
        partner: null,
        vehicleType: req.partner.vehicleType,
      },
      {
        $set: {
          partner: req.partner._id,
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      },
      {
        new: true,
      },
    )
      .populate("customer", "name phone profilePhoto")
      .populate({
        path: "partner",
        populate: {
          path: "user",
          select: "name phone profilePhoto",
        },
      });

    if (!ride) {
      return res.status(409).json({
        success: false,
        message: "Ride is no longer available",
      });
    }

    return res.json({
      success: true,
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    console.error("Accept ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept ride",
    });
  }
};

export const startRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      partner: req.partner._id,
      status: "ACCEPTED",
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Accepted ride not found",
      });
    }

    ride.status = "STARTED";
    ride.startedAt = new Date();

    await ride.save();

    return res.json({
      success: true,
      message: "Ride started successfully",
      ride,
    });
  } catch (error) {
    console.error("Start ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start ride",
    });
  }
};

export const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      partner: req.partner._id,
      status: "STARTED",
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Started ride not found",
      });
    }

    ride.status = "COMPLETED";
    ride.completedAt = new Date();

    await ride.save();

    return res.json({
      success: true,
      message: "Ride completed successfully",
      ride,
    });
  } catch (error) {
    console.error("Complete ride error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete ride",
    });
  }
};
