import Driver from "../../models/Core/Driver.js";
import jwt from "jsonwebtoken";

// Helper function to extract the token from the Authorization header
function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
}

// Create Driver Data (without vehicle assignment, with documents support)
async function addDriverData(req, res) {
  const token = getToken(req);
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const account_id = decoded.accountId; // Extract accountId from decoded token

    if (!account_id) {
      return res.status(400).json({ message: "Account ID is required" });
    }
    
    // Destructure all required fields from request body
    const {
      driverName,
      mobile,            // was previously 'contact'
      aadhar,
      dlNumber,
      dlIssueDate,
      dlExpiryDate,
      base_salary,
      variablePay,
      bank_details,
      documents,
      assignedUsers,     // note: we later assign this to assigned_users in the model
    } = req.body;

    // Check if a driver with same Aadhar already exists
    const alreadyExist = await Driver.findOne({ aadhar });
    if (alreadyExist) {
      return res.status(400).json({ message: "Driver with same Aadhar number already exists" });
    }

    // Create a new Driver document
    const newDriver = new Driver({
      account_id,
      driverName,
      mobile,
      aadhar,
      dlNumber,
      dlIssueDate,
      dlExpiryDate,
      base_salary,
      variablePay,
      bank_details,
      documents: documents || [],
      assigned_users: assignedUsers || [],
    });

    // Save the document to the database
    const savedDriver = await newDriver.save();
    res.status(201).json({ message: "Driver data added successfully", driver: savedDriver });
  } catch (error) {
    console.error("Error adding driver data:", error);
    res.status(500).json({ error: "Failed to add driver data. Please try again." });
  }
}



const getAllDrivers = async (req, res) => {
  const token = getToken(req);
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const account_id = decoded.accountId; // adjust key name based on your token payload

    if (!account_id) {
      return res.status(400).json({ message: "Account ID is required." });
    }

    // Retrieve drivers associated with the account.
    // If your application should return all drivers (e.g., for Admin role) then adjust this logic accordingly.
    const drivers = await Driver.find({ account_id: account_id });
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching all drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers. Please try again." });
  }
};

// Read: Get Driver by Id
const getDriverById = async (req, res) => {
  const { driverId } = req.params;
  const token = getToken(req);
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: "Secret Key is missing" });
    }
    
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId; // Extract user ID from decoded token
    const userRole = decoded.role; // Extract user role

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Check if the user is an admin or an assigned user
    const isAdmin = userRole === "Admin";
    const isAssignedUser = driver.assigned_users.some(
      (user) => user.toString() === userId
    );
    
    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to view this driver.",
      });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver", error: error.message });
  }
};

// Update Driver Data (remove vehicle logic; update documents and other fields)
async function updateDriverData(req, res) {
  const token = getToken(req);
  const { driverId } = req.params;
  const { contact, assignedUsers, documents, driverName, dlNumber, dlIssueDate, dlExpiryDate } = req.body;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }
  
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: "Secret Key is missing" });
    }
    
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId; // Extract user ID from decoded token
    const userRole = decoded.role; // Extract user role
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Check if the user is an admin or an assigned user
    const isAdmin = userRole === "Admin";
    const isAssignedUser = driver.assigned_users.some(
      (user) => user.toString() === userId
    );
    
    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to update this driver.",
      });
    }
    
    // Update fields if provided
    driver.driverName = driverName || driver.driverName;
    driver.contact = contact || driver.contact;
    driver.dlNumber = dlNumber || driver.dlNumber;
    driver.dlIssueDate = dlIssueDate || driver.dlIssueDate;
    driver.dlExpiryDate = dlExpiryDate || driver.dlExpiryDate;
    driver.documents = documents || driver.documents;
    driver.assigned_users = assignedUsers || driver.assigned_users;
    
    const updatedDriver = await driver.save();
    
    res.status(200).json({
      message: "Driver updated successfully",
      driver: updatedDriver,
    });
  } catch (error) {
    console.error("Error updating driver data", error);
    res.status(500).json({ error: "Failed to update driver data." });
  }
}

// Delete Driver Data
async function deleteDriverData(req, res) {
  const { driverId } = req.params;
  const token = getToken(req);
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    const userRole = decoded.role; // Extract user role
    
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Check if the user is an admin or an assigned user
    const isAdmin = userRole === "Admin";
    const isAssignedUser = driver.assigned_users.some(
      (user) => user.toString() === userId
    );
    
    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to delete this driver.",
      });
    }
    
    await driver.deleteOne();
    
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver data:", error);
    res.status(500).json({ error: "Failed to delete driver data." });
  }
}

export { getAllDrivers,addDriverData, getDriverById, updateDriverData, deleteDriverData };
