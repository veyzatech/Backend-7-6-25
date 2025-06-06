import VehicleGroup from "../../models/Core/VehicleGroup.js";
// Function to create a new vehicle group
import jwt from "jsonwebtoken";

export const createVehicleGroup = async (req, res) => {
  const token = req.cookies.TOKEN; // Extract token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const accountId = decoded.accountId; // Extract accountId from decoded token

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const { groupName, groupType, status, vehicles, assignedUsers } = req.body;

    const newGroup = new VehicleGroup({
      account_id: accountId,
      group_name: groupName,
      group_type: groupType,
      status: status,
      vehicles: vehicles || [],
      assigned_users: assignedUsers || [],
    });

    const savedGroup = await newGroup.save();

    res.status(201).json({
      message: "Vehicle group created successfully",
      vehicleGroup: savedGroup,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating vehicle group: ${error.message}` });
  }
};

// Function to get vehicle group details by ID
export const getVehicleGroupById = async (req, res) => {
  const { groupId } = req.params;
  const token = req.cookies.TOKEN; // Extract token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId; // Extract user ID from decoded token
    const userRole = decoded.role; // Extract user role

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the vehicle group
    const group = await VehicleGroup.findById(groupId)
      .populate("account_id", "account_name") // Populate account name
      .populate("vehicles", "vehicle_number") // Populate vehicle number
      .populate("assigned_users", "user_name"); // Populate assigned user names

    if (!group) {
      return res.status(404).json({ message: "Vehicle group not found" });
    }

    // Check if the user is an admin or an assigned user
    const isAdmin = userRole === "Admin";
    const isAssignedUser = group.assigned_users.some(
      (user) => user._id.toString() === userId
    );

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(group);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching vehicle group: ${error.message}` });
  }
};

// Function to update vehicle group details
export const updateVehicleGroup = async (req, res) => {
  const { groupId } = req.params;
  const { groupName, groupType, status, vehicles, assignedUsers } = req.body;
  const token = req.cookies.TOKEN; // Extract token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  try {
    // Ensure JWT_SECRET is available
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: "Secret Key is missing " });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId; // Extract user ID from decoded token
    const userRole = decoded.role; // Extract user role

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the vehicle group
    const group = await VehicleGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Vehicle group not found" });
    }

    // Check if the user is an admin or an assigned user
    const isAdmin = userRole === "Admin";
    const isAssignedUser = group.assigned_users.some(
      (user) => user._id.toString() === userId
    );

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to update this group.",
      });
    }

    // Update fields if provided
    group.group_name = groupName || group.group_name;
    group.group_type = groupType || group.group_type;
    group.status = status || group.status;
    group.vehicles = vehicles || group.vehicles;
    group.assigned_users = assignedUsers || group.assigned_users;

    const updatedGroup = await group.save();

    res.status(200).json({
      message: "Vehicle group updated successfully",
      vehicleGroup: updatedGroup,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating vehicle group: ${error.message}` });
  }
};

// Function to delete a vehicle group
export const deleteVehicleGroup = async (req, res) => {
  const { groupId } = req.params;
  const token = req.cookies.TOKEN; // Extract token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userRole = decoded.role; // Extract user role

    // Only Admins can delete a vehicle group
    if (userRole !== "Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only Admins can delete groups." });
    }

    // Find the vehicle group
    const group = await VehicleGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Vehicle group not found" });
    }

    await group.deleteOne();

    res.status(200).json({ message: "Vehicle group deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting vehicle group: ${error.message}` });
  }
};
