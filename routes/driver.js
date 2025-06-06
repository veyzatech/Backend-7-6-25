import express from "express";
import { authenticateUser } from "../middlewares/userAuth.js";
import { 
    addDriverData,
    getAllDrivers,
    getDriverById,
    updateDriverData,
    deleteDriverData, 
} from "../controllers/main/driver.js";
import { sendOTP, verifyOTP, logoutDriver } from "../controllers/main/driverController.js";

const router = express.Router();

// Routes for vehicle group CRUD operations
router.get("/drivers", authenticateUser, getAllDrivers); // Get all vehicle groups
router.post("/create-driver", authenticateUser, addDriverData); // Create a new vehicle group
router.get("/driver/:driverId", authenticateUser, getDriverById); // Get a vehicle group by ID
router.put("/driver/:driverId", updateDriverData); // Update vehicle group by ID
router.delete("/driver/:driverId", deleteDriverData); // Delete vehicle group by ID
// OTP and Authentication Endpoints
router.post("/driver/send-otp", sendOTP);             // Send OTP to driver mobile
router.post("/driver/verify-otp", verifyOTP);         // Verify OTP and create a new session
router.post("/driver/logout", logoutDriver);          // Logout driver by deactivating sessions


export default router;