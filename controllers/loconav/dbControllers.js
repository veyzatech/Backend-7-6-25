// import ConcorLocationsDetailed from "../../models/ConcorLocationsDetailed.js";
import masterApiModel from "../../models/masterAPI.js";
// import Overspeeding from "../../models/Overspeeding.js";
// import StoppageReport from "../../models/Stoppage.js";

//API Hit Calls

//Function to update or create vehicle locations
async function updateOrCreateVehicleLocation(
  vehicleNumber,
  newLocation,
  additionalUpdates = {}
) {
  try {
    // Create the update payload
    const updatePayload = {
      $push: {
        locations: { location: newLocation, timestamp: new Date() }, // Append the new location
      },
      $set: {
        ...additionalUpdates, // Allow additional fields like odometer, vehicleStatus, etc.
        lastUpdatedAt: new Date(), // Update the timestamp of the last update
      },
    };

    // Either create a new vehicle or update an existing one
    const updatedVehicle = await ConcorLocationsDetailed.findOneAndUpdate(
      { vehicleNumber }, // Search for the vehicle by its unique number
      updatePayload, // Apply the update
      { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
    );

    console.log("Updated or Created Vehicle:", updatedVehicle);
    return updatedVehicle;
  } catch (err) {
    console.error("Error updating or creating vehicle location:", err);
    throw err;
  }
}

// async function updateOrCreateOverSpeedingRecord(
//   vehicleNumber,
//   newLocation,
//   lat,
//   lng,
//   speed,
//   additionalUpdates = {}
// ) {
//   try {
//     // Create the update payload
//     speed = speed || 0;
//     const updatePayload = {
//       $push: {
//         locations: {
//           location: newLocation,
//           timestamp: new Date(),
//           lat,
//           lng,
//           speed,
//         }, // Append the new location
//       },
//       $set: {
//         ...additionalUpdates, // Allow additional fields like odometer, vehicleStatus, etc.
//         lastUpdatedAt: new Date(), // Update the timestamp of the last update
//         completionDateTime: new Date(),
//       },
//     };

//     // Either create a new vehicle or update an existing one
//     const updatedVehicle = await Overspeeding.findOneAndUpdate(
//       { vehicleNumber }, // Search for the vehicle by its unique number
//       updatePayload, // Apply the update
//       { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
//     );

//     console.log("Updated or Created Vehicle overspeeding:", updatedVehicle);
//     return updatedVehicle;
//   } catch (err) {
//     console.error("Error updating or creating vehicle OverSpeeding:", err);
//     throw err;
//   }
// }

// async function updateOrCreateStoppageReport(item, additionalUpdates = {}) {
//   try {
//     vehicleNumber = item.number;
//     newLocation = item.location || "NAN";
//     startDateTime = item.startDateTime || new Date();
//     endDateTime = item.endDateTime || new Date();
//     unscheduledStoppage = item.unscheduledStoppage || false;
//     geoFenceStoppage = item.geoFenceStoppage || false;
//     timeDuration = item.timeDuration || 0;
//     const updatePayload = {
//       $push: {
//         locations: {
//           location: newLocation,
//           timestamp: new Date(),
//           startDateTime,
//           endDateTime,
//           unscheduledStoppage,
//           geoFenceStoppage,
//           timeDuration,
//         }, // Append the new location
//       },
//       $set: {
//         ...additionalUpdates, // Allow additional fields like odometer, vehicleStatus, etc.
//         // lastUpdatedAt: new Date(), // Update the timestamp of the last update
//         // completionDateTime: new Date(),
//       },
//     };

//     // Either create a new vehicle or update an existing one
//     const updatedVehicle = await StoppageReport.findOneAndUpdate(
//       { vehicleNumber }, // Search for the vehicle by its unique number
//       updatePayload, // Apply the update
//       { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
//     );

//     console.log("Updated or Created Stoppage:", updatedVehicle);
//     S;
//     return updatedVehicle;
//   } catch (err) {
//     console.error("Error updating or creating vehicle Stoppage:", err);
//     throw err;
//   }
// }

async function updatedOrCreateMasterAPI(item, additionalUpdates = {}) {
  try {
    // console.log(item);
    const vehicleNumber = item.number;
    const locationAt = item.lastLocation;
    const timestamp = new Date();
    const temperature = item.currentTemperature || "NAN";
    const gpsStatus = true;
    const lat = item.movementLat || 0; //chech attribute name
    const lng = item.movementLong || 0;
    const speed = item.movementSpeedValue || "NAN";
    const speedLocation = item?.speedLocation || "NAN";
    const odoMeterReading = item.currentOdometerReading || 0;
    const gpsStatusLastUpdated = item.statusMessageReceivedAt; //check
    const lastStatusReceivedAt = item.lastStatusReceivedAt;
    const ignition = item.ignitionStatus || "NAN";
    const motionStat = item.motionStatus || "NAN";
    const updatePayload = {
      $push: {
        locations: {
          locationAt,
          timestamp,
          temperature,
          gpsStatus,
          lat,
          lng,
          speed,
          speedLocation,
          odoMeterReading,
          gpsStatusLastUpdated,
          lastStatusReceivedAt,
          ignition,
          motionStat,
        }, // Append the new location
      },
      $set: {
        ...additionalUpdates, // Allow additional fields like odometer, vehicleStatus, etc.
        // lastUpdatedAt: new Date(), // Update the timestamp of the last update
        // completionDateTime: new Date(),
      },
    };

    // Either create a new vehicle or update an existing one
    const updatedVehicle = await masterApiModel.findOneAndUpdate(
      { vehicleNumber }, // Search for the vehicle by its unique number
      updatePayload, // Apply the update
      { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
    );

    console.log("Updated or Created masterAPI:");

    return updatedVehicle;
  } catch (err) {
    console.error("Error updating or creating masterAPI:", err);
    throw err;
  }
}

export { updateOrCreateVehicleLocation, updatedOrCreateMasterAPI };
