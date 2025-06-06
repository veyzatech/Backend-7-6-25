import express from "express";
import {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAllUserVehicles,
  assignVehicleToUser,
  syncVehicleLiveLocation,
} from "../controllers/main/vehicle.js";
// import { syncVehicleLiveLocation } from "../controllers/main/trips.js";
import { authenticateUser } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/add-vehicle", authenticateUser, addVehicle); // Add a vehicle
router.get("/vehicles", authenticateUser, getAllVehicles); // Get all vehicles for admin
router.get("/my-vehicles", authenticateUser, getAllUserVehicles); // Get all vehicles for admin
router.post("/assign-vehicle", authenticateUser, assignVehicleToUser); // Get all vehicles for admin
router.get("/vehicles/:vehicleId", getVehicleById); // Get a single vehicle
router.put("/vehicles/:vehicleId", updateVehicle); // Update a vehicle
router.delete("/vehicles/:vehicleId", deleteVehicle); // Delete a vehicle
router.post("/vehicle/sync-live-location", syncVehicleLiveLocation);

export default router;
