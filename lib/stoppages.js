import dailyStatus from "../models/Production/dailyStatus.js";
import GeoFenceMap from "../models/Production/geoFence.js";
import globalVariable from "../models/Production/globalVariable.js";

// Haversine formula to calculate distance between two lat/lng points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}
// Function to check if a point is inside a circular geofence
function isInsideGeofence(userLat, userLon, geofenceLat, geofenceLon, radius) {
  const distance = haversine(userLat, userLon, geofenceLat, geofenceLon);
  return distance <= radius; // Check if the user is within the geofence radius
  //return true if inside geofence
}
async function initiatingUnscheduledStoppage(item, additionalUpdates = {}) {
  try {
    // console.log(
    //   `Parsed data initiating unscheduled stoppage: ${JSON.stringify(item)}`
    // );
    const vehicleNumber = item.number;
    console.log(`Initiating unscheduled stoppage for ${vehicleNumber}`);

    const startingTime = item.statusMessageReceivedAt; // Ensure this field exists in `item`
    const endingTime = ""; // Default value
    const totalTime = 0; // Default value

    const updatePayload = {
      $push: {
        unscheduledStops: {
          startingTime,
          endingTime,
          totalTime,
        }, // Append the new unscheduled stop
      },
      $set: {
        ...additionalUpdates, // Apply any additional updates
      },
    };

    // Either create a new vehicle or update an existing one
    const updatedVehicle = await dailyStatus.findOneAndUpdate(
      { vehicleNumber }, // Search for the vehicle by its unique number
      updatePayload, // Apply the update
      { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
    );

    // console.log(
    //   "Updated or Created dailyStatus for unscheduledStops:",
    //   updatedVehicle
    // );

    return updatedVehicle;
  } catch (err) {
    console.error(
      "Error updating or creating dailyStatus for unscheduled Stops:",
      err
    );
    throw err;
  }
}
async function initiatingGeofenceStoppage(item, additionalUpdates = {}) {
  try {
    const vehicleNumber = item.number;
    console.log(`Initiating geofence stoppage for ${vehicleNumber}`);

    const startingTime = item.statusMessageReceivedAt; // Ensure this field exists in `item`
    const endingTime = ""; // Default value
    const totalTime = 0; // Default value

    const updatePayload = {
      $push: {
        geoFenceStops: {
          startingTime,
          endingTime,
          totalTime,
        }, // Append the new unscheduled stop
      },
      $set: {
        ...additionalUpdates, // Apply any additional updates
      },
    };

    // Either create a new vehicle or update an existing one
    const updatedVehicle = await dailyStatus.findOneAndUpdate(
      { vehicleNumber }, // Search for the vehicle by its unique number
      updatePayload, // Apply the update
      { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
    );

    // console.log(
    //   "Updated or Created dailyStatus for geoFenceStops:",
    //   updatedVehicle
    // );

    return updatedVehicle;
  } catch (err) {
    console.error(
      "Error updating or creating dailyStatus for geoFence Stops:",
      err
    );
    throw err;
  }
}
async function initiatingIdilingStoppage(item, additionalUpdates = {}) {
  try {
    // console.log(
    //   `Parsed data initiating idiling stoppage: ${JSON.stringify(item)}`
    // );
    const vehicleNumber = item.number;
    console.log(`Initiating idiling stoppage for ${vehicleNumber}`);

    const startingTime = item.statusMessageReceivedAt; // Ensure this field exists in `item`
    const endingTime = ""; // Default value
    const totalTime = 0; // Default value

    const updatePayload = {
      $push: {
        idlingStops: {
          startingTime,
          endingTime,
          totalTime,
        }, // Append the new unscheduled stop
      },
      $set: {
        ...additionalUpdates, // Apply any additional updates
      },
    };

    // Either create a new vehicle or update an existing one
    const updatedVehicle = await dailyStatus.findOneAndUpdate(
      { vehicleNumber }, // Search for the vehicle by its unique number
      updatePayload, // Apply the update
      { new: true, upsert: true } // If the vehicle doesn't exist, create it; return the updated document
    );

    // console.log(
    //   "Updated or Created dailyStatus for idilingStops:",
    //   updatedVehicle
    // );

    return updatedVehicle;
  } catch (err) {
    console.error(
      "Error updating or creating dailyStatus for idiling Stops:",
      err
    );
    throw err;
  }
}

async function endingUnscheduledStoppage(item, additionalUpdates = {}, value) {
  try {
    console.log("Ending unscheduled stoppage");

    // if (!vehicle.unscheduledStops || vehicle.unscheduledStops.length === 0) {
    //   throw new Error("No unscheduled stops found");
    // }
    if (!item.number) {
      throw new Error(
        "vehicleNumber is required and cannot be null or undefined"
      );
    }

    // Find the vehicle document
    const vehicle = await dailyStatus.findOne({ vehicleNumber: item.number });
    console.log("Vehicle found:", vehicle);

    // if (!vehicle) {
    //   throw new Error("Vehicle not found");
    // }

    // Check if there are any unscheduled stops

    // Get the last unscheduled stop
    const lastStop =
      vehicle.unscheduledStops[vehicle.unscheduledStops.length - 1];
    console.log(
      `value before conversion ${lastStop?.startingTime}, ${item.statusMessageReceivedAt}`
    );
    // Convert startingTime and endingTime to timestamps
    const startTime = new Date(lastStop?.startingTime).getTime();
    const endTime = new Date(item.statusMessageReceivedAt).getTime();
    // const startTime = new Date(lastStop.startingTime).getTime(); // Convert to timestamp
    // const endTime = new Date(item.statusMessageReceivedAt).getTime(); // Convert to timestamp
    console.log(`value of start and entime : ${startTime}, ${endTime}`);
    // Calculate totalTime in minutes
    const totalTime = (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes

    if (totalTime > 30) {
      // yaha alert jayenge
    }

    // Determine the bucket type based on totalTime
    // const type = bucket(totalTime);

    // Update the last unscheduled stop
    const endingTime = item.statusMessageReceivedAt; // Save as string
    lastStop.endingTime = endingTime;
    lastStop.totalTime = totalTime;
    // lastStop.type = type;

    // Update unsheduledStoppageCount and timeDurationUnscheduledStoppage
    vehicle.unsheduledStoppageCount =
      (vehicle.unsheduledStoppageCount || 0) + 1;
    vehicle.timeDurationUnscheduledStoppage =
      (vehicle.timeDurationUnscheduledStoppage || 0) + totalTime;

    // Save the updated document
    await vehicle.save();
    // console.log("Updated ending point for unscheduled stoppage:", vehicle);
  } catch (err) {
    console.error("Error updating endpoint for unscheduled stoppages:", err);

    // If an error occurs, update the globalVariable with the new data
    const lat1 = value[0];
    const long1 = value[1];
    const lat2 = item.movementLat;
    const long2 = item.movementLong;

    await dataInsertionGlobalVariable(item.number, lat1, long1, lat2, long2);
  }
}
async function endingIdilingStoppage(item, additionalUpdates = {}, value) {
  try {
    console.log("Ending idiling stoppage");

    // if (!vehicle.unscheduledStops || vehicle.unscheduledStops.length === 0) {
    //   throw new Error("No unscheduled stops found");
    // }
    if (!item.number) {
      throw new Error(
        "vehicleNumber is required and cannot be null or undefined"
      );
    }

    // Find the vehicle document
    const vehicle = await dailyStatus.findOne({ vehicleNumber: item.number });
    console.log("Vehicle found:", vehicle);

    // if (!vehicle) {
    //   throw new Error("Vehicle not found");
    // }

    // Check if there are any unscheduled stops

    // Get the last unscheduled stop
    const lastStop = vehicle.idlingStops[vehicle.idlingStops.length - 1];
    // console.log(`value before conversion ${lastStop?.startingTime}, ${item.statusMessageReceivedAt}`)
    // Convert startingTime and endingTime to timestamps
    const startTime = new Date(lastStop?.startingTime).getTime();
    const endTime = new Date(item.statusMessageReceivedAt).getTime();
    // const startTime = new Date(lastStop.startingTime).getTime(); // Convert to timestamp
    // const endTime = new Date(item.statusMessageReceivedAt).getTime(); // Convert to timestamp
    console.log(`value of start and entime : ${startTime}, ${endTime}`);
    // Calculate totalTime in minutes
    const totalTime = (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes

    if (totalTime > 30) {
      // yaha alert jayenge
    }

    // Determine the bucket type based on totalTime
    // const type = bucket(totalTime);

    // Update the last unscheduled stop
    lastStop.endingTime = item.statusMessageReceivedAt; // Save as string
    lastStop.totalTime = totalTime;
    // lastStop.type = type;

    // Update unsheduledStoppageCount and timeDurationUnscheduledStoppage
    vehicle.idlingCount = (vehicle.idlingCount || 0) + 1;
    vehicle.timeDurationIdling = (vehicle.timeDurationIdling || 0) + totalTime;

    // Save the updated document
    await vehicle.save();
    // console.log("Updated ending point for idiling stoppage:", vehicle);
  } catch (err) {
    console.error("Error updating endpoint for idiling stoppages:", err);

    // If an error occurs, update the globalVariable with the new data
    const lat1 = value[0];
    const long1 = value[1];
    const lat2 = item.movementLat;
    const long2 = item.movementLong;

    await dataInsertionGlobalVariable(item.number, lat1, long1, lat2, long2);
  }
}
async function endingGeofenceStoppage(item, additionalUpdates = {}, value) {
  try {
    console.log("Ending geofence stoppage");

    // if (!vehicle.unscheduledStops || vehicle.unscheduledStops.length === 0) {
    //   throw new Error("No unscheduled stops found");
    // }
    if (!item.number) {
      throw new Error(
        "vehicleNumber is required and cannot be null or undefined"
      );
    }

    // Find the vehicle document
    const vehicle = await dailyStatus.findOne({ vehicleNumber: item.number });
    console.log("Vehicle found:", vehicle);

    // if (!vehicle) {
    //   throw new Error("Vehicle not found");
    // }

    // Check if there are any unscheduled stops

    // Get the last unscheduled stop
    const lastStop = vehicle.geoFenceStops[vehicle.geoFenceStops.length - 1];
    console.log(
      `value before conversion ${lastStop?.startingTime}, ${item.statusMessageReceivedAt}`
    );
    // Convert startingTime and endingTime to timestamps
    const startTime = new Date(lastStop?.startingTime).getTime();
    const endTime = new Date(item.statusMessageReceivedAt).getTime();
    // const startTime = new Date(lastStop.startingTime).getTime(); // Convert to timestamp
    // const endTime = new Date(item.statusMessageReceivedAt).getTime(); // Convert to timestamp
    console.log(`value of start and entime : ${startTime}, ${endTime}`);
    // Calculate totalTime in minutes
    const totalTime = (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes

    if (totalTime > 30) {
      // yaha alert jayenge
    }

    // Update the last unscheduled stop
    lastStop.endingTime = item.statusMessageReceivedAt; // Save as string
    lastStop.totalTime = totalTime;
    // lastStop.type = type;

    // Update unsheduledStoppageCount and timeDurationUnscheduledStoppage
    vehicle.geoFenceStoppageCount = (vehicle.geoFenceStoppageCount || 0) + 1;
    vehicle.timeDurationGeoFence =
      (vehicle.timeDurationGeoFence || 0) + totalTime;

    // Save the updated document
    await vehicle.save();
    console.log("Updated ending point for geoFence stoppage:", vehicle);
  } catch (err) {
    console.error("Error updating endpoint for geoFence stoppages:", err);

    // If an error occurs, update the globalVariable with the new data
    const lat1 = value[0];
    const long1 = value[1];
    const lat2 = item.movementLat;
    const long2 = item.movementLong;

    await dataInsertionGlobalVariable(item.number, lat1, long1, lat2, long2);
  }
}
async function dataInsertionGlobalVariable(
  vehicleNumber,
  lat1,
  long1,
  lat2,
  long2,
  idiling,
  geoStoppage
) {
  try {
    // Unique identifier for the document
    const uniqueDocId = "uniqueDocumentId";

    // Use findOneAndUpdate with upsert to ensure atomicity
    const result = await globalVariable.findOneAndUpdate(
      { _id: uniqueDocId }, // Query to find the document
      {
        $setOnInsert: { _id: uniqueDocId }, // Set _id only on insert
        $set: {
          [`hashMap.${vehicleNumber}`]: [
            lat1,
            long1,
            lat2,
            long2,
            idiling,
            geoStoppage,
          ],
        }, // Update the hashMap
      },
      {
        upsert: true, // Create the document if it doesn't exist
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (result) {
      console.log("Data updated/inserted successfully!");
    }
  } catch (error) {
    console.error("Error inserting/updating data:", error);
  }
}
function equal(lat1, long1, lat2, long2) {
  if (lat1 === lat2 && long1 === long2) {
    return true;
  } else {
    return false;
  }
}

export {
  isInsideGeofence,
  initiatingUnscheduledStoppage,
  initiatingGeofenceStoppage,
  initiatingIdilingStoppage,
  // getMinutesDifference,
  endingUnscheduledStoppage,
  endingIdilingStoppage,
  endingGeofenceStoppage,
  dataInsertionGlobalVariable,
  equal,
};
