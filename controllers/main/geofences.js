import Geofence from "../../models/Core/Geofences.js";
import User from "../../models/Core/User.js";

// Create a new geofence (automatically assigns account_id from logged-in user)  --tested
export const createGeofence = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //to check if geofence already exist??
    const alreadyExistFlag = await Geofence.findOne({ 
      name: req.body.name, 
      account_id: user.account_id 
    });
    
    if (alreadyExistFlag) {
      return res.status(400).json({ message: "Geofence already exists for this account." });
    }

    const geofence = new Geofence({
      ...req.body,
      account_id: user.account_id, // Assign geofence to user's account
    });

    await geofence.save();
    res
      .status(201)
      .json({ message: "Geofence created successfully", geofence });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating geofence", error: error.message });
  }
};

// Get all geofences for the logged-in user's account --tested
export const getGeofencesForUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const geofences = await Geofence.find({ account_id: user.account_id });
    res.status(200).json(geofences);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching geofences", error: error.message });
  }
};

// Get a specific geofence by ID
export const getGeofenceById = async (req, res) => {
  try {
    const geofence = await Geofence.findById(req.params.id);
    if (!geofence)
      return res.status(404).json({ message: "Geofence not found" });

    res.status(200).json(geofence);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching geofence", error: error.message });
  }
};
//
// Update a geofence (only if it belongs to the user's account)
export const updateGeofence = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const geofence = await Geofence.findOneAndUpdate(
      { _id: req.params.id, account_id: user.account_id },
      req.body,
      { new: true }
    );

    if (!geofence)
      return res
        .status(404)
        .json({ message: "Geofence not found or unauthorized" });

    res
      .status(200)
      .json({ message: "Geofence updated successfully", geofence });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating geofence", error: error.message });
  }
};

//  Delete a geofence (only if it belongs to the user's account)
export const deleteGeofence = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const geofence = await Geofence.findOneAndDelete({
      _id: req.params.id,
      account_id: user.account_id,
    });

    if (!geofence)
      return res
        .status(404)
        .json({ message: "Geofence not found or unauthorized" });

    res.status(200).json({ message: "Geofence deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting geofence", error: error.message });
  }
};
