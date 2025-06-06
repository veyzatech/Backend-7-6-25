import express from "express";
import {
  createVehicleGroup,
  getVehicleGroupById,
  updateVehicleGroup,
  deleteVehicleGroup,
} from "../controllers/main/vehicleGroup.js";
import { authenticateUser } from "../middlewares/userAuth.js";

const router = express.Router();

// Routes for vehicle group CRUD operations
router.post("/create-vehicle-groups", authenticateUser, createVehicleGroup); // Create a new vehicle group
router.get("/vehicle-groups/:groupId", authenticateUser, getVehicleGroupById); // Get a vehicle group by ID
router.put("/vehicle-groups/:groupId", updateVehicleGroup); // Update vehicle group by ID
router.delete("/vehicle-groups/:groupId", deleteVehicleGroup); // Delete vehicle group by ID

export default router;
