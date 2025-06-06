import TripModel from "../../models/Production/trip.js";

// Create
async function addTripData(req, res) {
  try {
    const {
      vehicleNo,
      routeDetail,
      tripStatus, // This is a field in the request body
      startInfo,
      eta,
      distance,
      fuel,
    } = req.body;

    // Create a new trip document
    const newTrip = new TripModel({
      vehicleNo,
      routeDetail,
      tripStatus, // Assigning the value from req.body
      startInfo,
      eta,
      distance,
      fuel,
    });

    // Save the document to the database
    const savedTrip = await newTrip.save(); // Correct usage to save the instance

    res.status(201).json({
      message: "Trip data added successfully",
      savedTrip,
    });
  } catch (error) {
    console.error("Error adding trip data:", error);
    res.status(500).json({
      error: "Failed to add trip data. Please try again.",
    });
  }
}

// Read
async function fetchTripData(req, res) {
  try {
    const data = await TripModel.find({}); // Fetch all trip data from MongoDB
    res.status(200).json(data); // Send the data as JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch trip data." }); // Send error message
  }
}

//Update
// async function updateGeoFenceData(req, res) {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     // Validate that at least one field is provided for updating
//     if (!Object.keys(updates).length) {
//       return res.status(400).json({ error: "No fields provided to update." });
//     }

//     // Find and update the geoFence document by id
//     const updatedGeofence = await GeoFenceMap.findOneAndUpdate(
//       { _id: id }, //_id is mongo key called _id and id is passed by user
//       { $set: updates },
//       { new: true } // Return the updated document
//     );

//     if (!updatedGeofence) {
//       return res
//         .status(404)
//         .json({ error: "Geofence not found with the given id." });
//     }

//     res.status(200).json({
//       message: "Geofence data updated successfully",
//       driver: updatedGeofence,
//     });
//   } catch (error) {
//     console.error("Error updating geofence data by id:", error);
//     res.status(500).json({ error: "Failed to update geofence data." });
//   }
// }

// //DELETE

// async function deleteGeoFenceData(req, res) {
//   try {
//     const { id } = req.params;

//     // Check if the geofence exists
//     const geofence = await GeoFenceMap.findOne({ _id: id }); //_id is mongo key while id is passed by user
//     if (!geofence) {
//       return res
//         .status(404)
//         .json({ error: "Geofence not found with the given id." });
//     }

//     // Delete the geofence
//     await GeoFenceMap.deleteOne({ _id: id });

//     res.status(200).json({
//       message: `Geofence with id: ${id} deleted successfully.`,
//     });
//   } catch (error) {
//     console.error("Error deleting geoFence data:", error);
//     res.status(500).json({ error: "Failed to delete Geofence data." });
//   }
// }

export { fetchTripData, addTripData };
