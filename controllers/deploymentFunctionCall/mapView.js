import masterApiModel from "../../models/masterAPI.js";

async function getAllVehiclesLastLocation(req, res) {
  try {
    // Fetch all vehicles with the last location from the locations array
    const vehiclesData = await masterApiModel.aggregate([
      {
        $project: {
          vehicleNumber: 1,
          lastLocation: { $arrayElemAt: ["$locations", -1] }, // Get the last element in the locations array
        },
      },
    ]);
    if (!vehiclesData || vehiclesData.length === 0) {
      return { message: "No vehicle data available." };
    }
    // Format the results to include vehicleNumber, lat, lng, and timestamp
    const vehiclesLastLocations = vehiclesData.map((vehicle) => {
      const { lastLocation } = vehicle;
      if (lastLocation) {
        return {
          vehicleNumber: vehicle.vehicleNumber,
          lat: lastLocation.lat,
          lng: lastLocation.lng,
          timestamp: lastLocation.timestamp,
          location : lastLocation.locationAt,
          motionStatus : lastLocation.motionStat,
        };
      }

      return {
        vehicleNumber: vehicle.vehicleNumber,
        lat: null,
        lng: null,
        timestamp: null,
        location: null,
        motionStatus: null,
        message: "No location data available",
      };
    });
    return res.status(200).json(vehiclesLastLocations);
  } catch (error) {
    console.error(
      "Error fetching all vehicles' last locations:",
      error.message,
      error.stack
    );
    return { message: "An error occurred while fetching vehicle locations." };
  }
}

async function getLastLocation(vehicleNumber) {
  try {
    const vehicleData = await masterApiModel.findOne(
      { vehicleNumber },
      {
        vehicleNumber: 1,
        lastLocation: { $arrayElemAt: ["$locations", -1] }, // Get the last element in the locations array
      }
    );

    if (!vehicleData || !vehicleData.lastLocation) {
      return { message: "No locations found for this vehicle." };
    }

    return {
      lat: vehicleData.lastLocation.lat,
      lng: vehicleData.lastLocation.lng,
      timestamp: vehicleData.lastLocation.timestamp,
    };
  } catch (error) {
    console.error("Error fetching last location:", error.message, error.stack);
    return { message: "An error occurred while fetching the last location." };
  }
}

export {
  /* fetchVehicleLocations,*/ getAllVehiclesLastLocation,
  getLastLocation,
};
