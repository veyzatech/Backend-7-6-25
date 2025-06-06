import Vehicle from "../../models/Core/Vehicle.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/Core/User.js";
import mongoose from "mongoose";

// Add new vehicle
export const addVehicle = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.TOKEN;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || !decoded.accountId || decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Assign accountId from token to the vehicle data
    const accountId = decoded.accountId;
    const { vehicleNumber } = req.body;
    if (!vehicleNumber) {
      return res.status(400).json({ message: "Vehicle number is required." });
    }
    // Check if a vehicle with the same vehicleNumber already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res
        .status(400)
        .json({ message: "Vehicle with this number already exists." });
    }

    // Create a new vehicle with accountId from token
    const vehicleData = { ...req.body, accountId, vehicleId: uuidv4() };
    const vehicle = new Vehicle(vehicleData);

    // Save the vehicle to DB
    await vehicle.save();
    res.status(201).json({ message: "Vehicle added successfully", vehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding vehicle", error: error.message });
  }
};

// Get All Vehicles -- ADMIN Only
export const getAllVehicles = async (req, res) => {
  try {
    // Extract token from the Authorization header
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { vehicleNumber } = req.query;
    let query = {};

    // If vehicleNumber is provided, search using regex for partial match
    if (vehicleNumber) {
      query.vehicleNumber = { $regex: vehicleNumber, $options: "i" };
    }

    // Fetch vehicles based on the query
    const vehicles = await Vehicle.find(query);
    res.status(200).json(vehicles);
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vehicles", error: error.message });
  }
};

//Assign Vehicle to User(Operations team etc)
export const assignVehicleToUser = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.TOKEN;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { vehicleId, userId } = req.body;

    // Validate input
    if (!vehicleId || !userId) {
      return res
        .status(400)
        .json({ message: "Vehicle ID and User ID are required." });
    }

    // Find the vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Check if the user is already assigned
    if (vehicle.assignedUsers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already assigned to this vehicle." });
    }

    // Assign the vehicle to the user
    vehicle.assignedUsers.push(userId);
    await vehicle.save();
    if (!user.assigned_vehicles.includes(vehicleId)) {
      user.assigned_vehicles.push(vehicleId);
      await user.save();
    }
    res.status(200).json({ message: "Vehicle assigned successfully", vehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning vehicle", error: error.message });
  }
};

//Get All Vehicles --user assigned
export const getAllUserVehicles = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.TOKEN;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const userId = decoded.userId;
    const { vehicleNumber } = req.query;

    let query = { assignedUsers: userId };

    // If vehicleNumber is provided, search using regex for partial match
    if (vehicleNumber) {
      query.vehicleNumber = { $regex: vehicleNumber, $options: "i" }; // Case-insensitive search
    }

    // Fetch vehicles based on the query
    const vehicles = await Vehicle.find(query);

    res
      .status(200)
      .json({ message: "Vehicles retrieved successfully", vehicles });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving vehicles", error: error.message });
  }
};

// Get Single Vehicle by Id
export const getVehicleById = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.TOKEN;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || !decoded.accountId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { userId, role } = decoded;

    // Fetch the vehicle
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if the user is an admin or assigned to the vehicle
    const isAdmin = role === "Admin";
    const isAssigned = vehicle.assignedUsers.includes(userId);

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to view this vehicle.",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vehicle", error: error.message });
  }
};

// Update VehicleDetails
export const updateVehicle = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.TOKEN;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || !decoded.accountId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { userId, role } = decoded;

    // Fetch the vehicle
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if the user is an admin or assigned to the vehicle
    const isAdmin = role === "Admin";
    const isAssigned = vehicle.assignedUsers.includes(userId);

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({
        message:
          "Access denied. You are not authorized to update this vehicle.",
      });
    }

    // Update the vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.vehicleId,
      req.body,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Vehicle updated successfully", updatedVehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating vehicle", error: error.message });
  }
};

// Delete Vehicle --only by ADMIN
export const deleteVehicle = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.TOKEN;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can delete vehicles." });
    }

    // Find and delete the vehicle
    const deletedVehicle = await Vehicle.findByIdAndDelete(
      req.params.vehicleId
    );
    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found!" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting vehicle", error: error.message });
  }
};

// Optionally import fetch if needed:
// import fetch from "node-fetch";

export const syncVehicleLiveLocation = async (req, res) => {
  try {
    // Fetch live sensor data from external API.
    const response = await fetch("https://api.veyza.in/veyza-api/v0/get-live-location");
    const liveData = await response.json();
    
    // Here we assume the external API returns an array of vehicle objects.
    // Example objects in liveData:
    // {
    //   "_id": "67b2d538c40596c8110b7828",
    //   "vehicleNumber": "GJ15YY6602",
    //   "lastPacketReceivedAt": "...",
    //   "latitude": 20.745478,
    //   "longitude": 73.044472,
    //   "location": "...",
    //   "status": "Stopped since 12:08 PM"
    // }
    const vehiclesLiveData = Array.isArray(liveData) ? liveData : liveData.data || [];
    
    let updateCount = 0;
    let createCount = 0;

    // Ensure you have a default account id in your environment.
    
    for (const liveVehicle of vehiclesLiveData) {
      // Use vehicleNumber as a unique identifier.
      const sensorVehicleNumber = liveVehicle.vehicleNumber;
      if (!sensorVehicleNumber) continue; // Skip if no identifier
      const device = liveVehicle.device;
      const deviceId = liveVehicle.deviceNumber;
      
      // Look for an existing vehicle using vehicleNumber.
      let vehicle = await Vehicle.findOne({ vehicleNumber: sensorVehicleNumber });
      
      // Prepare new current location info from sensor data.
      const currentLocation = {
        latitude: liveVehicle.latitude,
        longitude: liveVehicle.longitude,
      };
      
      if (vehicle) {
        // Update existing vehicle's current location.
        vehicle.currentLocation = currentLocation;
        await vehicle.save();
        updateCount++;
      } else {
        // Create a new Vehicle document.
        const newVehicleData = {
          // Use sensor vehicleNumber for both uniqueId and vehicleNumber.
          uniqueId: sensorVehicleNumber,
          vehicleNumber: sensorVehicleNumber,
          // Provide default values that conform to your model's required fields.
          make: "Unknown",                    // Replace with a valid default if needed.
          model: "Unknown",                   // Replace with a valid default if needed.
          year: new Date().getFullYear(),
          type: "Car",                        // Allowed enum: "Truck", "Van", "Bike", "Car", "Bus", "Trailer"
          status: "Active",                   // Allowed enum: "Active", "Inactive", "Maintenance", "Out of Service"
          gpsProvider: "Loconav",             // Default provider (adjust as needed)
          gpsDeviceId: sensorVehicleNumber,   // Using vehicleNumber as deviceId if not provided.
          fuelType: "Petrol",                 // Allowed enum: "Petrol", "Diesel", "Electric", "Hybrid"
          capacity: 0,
          device: device,                      // Default device.
          deviceID: deviceId,                        // Default capacity.
          currentLocation,                    // Set from sensor data.
          registrationDate: new Date(),
          // You can set additional fields (like assignedUsers, etc.) if needed.
        };

        console.log(newVehicleData);
        const newVehicle = new Vehicle(newVehicleData);
        await newVehicle.save();
        createCount++;
      }
    }
    
    res.status(200).json({
      message: "Vehicle locations synchronized successfully",
      updated: updateCount,
      created: createCount,
      total: updateCount + createCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error syncing vehicle locations and numbers",
      error: error.message,
    });
  }
};
