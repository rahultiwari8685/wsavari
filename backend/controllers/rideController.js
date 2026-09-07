import Ride from "../models/Ride.js";

/*
|--------------------------------------------------------------------------
| CUSTOMER - CREATE RIDE
|--------------------------------------------------------------------------
*/

export const createRide = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create rides",
      });
    }

    const { pickup, destination, vehicleType, estimatedFare } = req.body;

    if (!pickup || !destination || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: "Pickup, destination and vehicle type are required",
      });
    }

    const ride = await Ride.create({
      customer: req.user._id,
      pickup,
      destination,
      vehicleType,
      estimatedFare,
      status: "SEARCHING",
    });

    res.status(201).json({
      success: true,
      message: "Ride request created",
      ride,
    });
  } catch (error) {
    console.error("Create ride error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create ride",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE RIDE
|--------------------------------------------------------------------------
*/

export const getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("customer", "name phone profilePhoto")
      .populate("partner");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error("Get ride error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get ride",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CUSTOMER - CANCEL RIDE
|--------------------------------------------------------------------------
*/

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

    if (ride.status === "COMPLETED" || ride.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: `Ride is already ${ride.status.toLowerCase()}`,
      });
    }

    ride.status = "CANCELLED";

    await ride.save();

    res.json({
      success: true,
      message: "Ride cancelled",
      ride,
    });
  } catch (error) {
    console.error("Cancel ride error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel ride",
    });
  }
};

/*
|--------------------------------------------------------------------------
| PARTNER - GET AVAILABLE RIDES
|--------------------------------------------------------------------------
*/

export const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "SEARCHING",
      partner: null,
    })
      .populate("customer", "name phone profilePhoto")
      .sort({ requestedAt: -1 });

    res.json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Get available rides error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get available rides",
    });
  }
};

/*
|--------------------------------------------------------------------------
| PARTNER - ACCEPT RIDE
|--------------------------------------------------------------------------
*/

export const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "SEARCHING",
        rider: null,
      },
      {
        $set: {
          rider: req.user._id,
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      },
      {
        new: true,
      },
    )
      .populate("customer", "name phone profilePhoto")
      .populate("rider", "name phone profilePhoto");

    if (!ride) {
      return res.status(409).json({
        success: false,
        message: "Ride is no longer available",
      });
    }

    res.json({
      success: true,
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    console.error("Accept ride error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to accept ride",
    });
  }
};

/*
|--------------------------------------------------------------------------
| PARTNER - START RIDE
|--------------------------------------------------------------------------
*/

export const startRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      rider: req.user._id,
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

    res.json({
      success: true,
      message: "Ride started successfully",
      ride,
    });
  } catch (error) {
    console.error("Start ride error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start ride",
    });
  }
};

/*
|--------------------------------------------------------------------------
| PARTNER - COMPLETE RIDE
|--------------------------------------------------------------------------
*/

export const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      rider: req.user._id,
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

    res.json({
      success: true,
      message: "Ride completed successfully",
      ride,
    });
  } catch (error) {
    console.error("Complete ride error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete ride",
    });
  }
};
