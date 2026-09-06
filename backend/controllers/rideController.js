import Ride from "../models/Ride.js";

// export const createRide = async (req, res) => {
//   try {
//     const { customer, pickup, destination, vehicleType, estimatedFare } =
//       req.body;

//     const ride = await Ride.create({
//       customer,
//       pickup,
//       destination,
//       vehicleType,
//       estimatedFare,
//       status: "SEARCHING",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Ride request created",
//       ride,
//     });
//   } catch (error) {
//     console.error("Create ride error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create ride",
//     });
//   }
// };

export const createRide = async (req, res) => {
  try {
    const { pickup, destination, vehicleType, estimatedFare } = req.body;

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
export const getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("customer")
      .populate("rider");

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

export const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
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

export const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "SEARCHING",
      rider: null,
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
