import GeoFenceMap from "../../models/Production/geoFence.js";

//Create
async function addGeoFenceData(req, res) {
  try {
    const { geoFenceName, latitude, longitude, radius } = req.body;

    // Create a new geofence document
    const newGeoFence = new GeoFenceMap({
      geoFenceName,
      latitude,
      longitude,
      radius,
    });

    // Save the document to the database
    const savedGeoFence = await newGeoFence.save(); // Corrected to use the instance method

    res.status(201).json({
      message: "Geofence data added successfully",
      savedGeoFence, // Correctly returning the saved document
    });
  } catch (error) {
    console.error("Error adding Geofence data:", error);
    res.status(500).json({
      error: "Failed to add Geofence data. Please try again.",
    });
  }
}

//Read
async function fetchGeoFenceData(req, res) {
  try {
    const data = await GeoFenceMap.find({}); // Get geofence data from MongoDB
    res.status(200).json(data); // Send the data as JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch geofence data." }); // Send error message
  }
}

//Update
async function updateGeoFenceData(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate that at least one field is provided for updating
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields provided to update." });
    }

    // Find and update the geoFence document by id
    const updatedGeofence = await GeoFenceMap.findOneAndUpdate(
      { _id: id }, //_id is mongo key called _id and id is passed by user
      { $set: updates },
      { new: true } // Return the updated document
    );

    if (!updatedGeofence) {
      return res
        .status(404)
        .json({ error: "Geofence not found with the given id." });
    }

    res.status(200).json({
      message: "Geofence data updated successfully",
      driver: updatedGeofence,
    });
  } catch (error) {
    console.error("Error updating geofence data by id:", error);
    res.status(500).json({ error: "Failed to update geofence data." });
  }
}

//DELETE

async function deleteGeoFenceData(req, res) {
  try {
    const { id } = req.params;

    // Check if the geofence exists
    const geofence = await GeoFenceMap.findOne({ _id: id }); //_id is mongo key while id is passed by user
    if (!geofence) {
      return res
        .status(404)
        .json({ error: "Geofence not found with the given id." });
    }

    // Delete the geofence
    await GeoFenceMap.deleteOne({ _id: id });

    res.status(200).json({
      message: `Geofence with id: ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting geoFence data:", error);
    res.status(500).json({ error: "Failed to delete Geofence data." });
  }
}

//Search Geofence
async function searchGeoFenceData(req, res) {
  try {
    const { name } = req.query; // Get search query from request parameters

    if (!name) {
      return res.status(400).json({ error: "Please provide a search name." });
    }

    // Perform a case-insensitive search using a regex pattern
    const geoFences = await GeoFenceMap.find({
      geoFenceName: { $regex: name, $options: "i" }, // "i" makes it case-insensitive
    });

    if (geoFences.length === 0) {
      return res.status(404).json({ message: "No matching geofences found." });
    }

    res.status(200).json(geoFences);
  } catch (error) {
    console.error("Error searching geofence data:", error);
    res.status(500).json({ error: "Failed to search geofence data." });
  }
}

export {
  fetchGeoFenceData,
  addGeoFenceData,
  updateGeoFenceData,
  deleteGeoFenceData,
  searchGeoFenceData,
};
