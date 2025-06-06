import express from "express";
import {
  createGeofence,
  deleteGeofence,
  getGeofenceById,
  getGeofencesForUser,
  updateGeofence,
} from "../controllers/main/geofences.js";
import { authenticateUser } from "../middlewares/userAuth.js";

const router = express.Router();
router.post("/create-geofence", authenticateUser, createGeofence);
router.get("/geofences", authenticateUser, getGeofencesForUser);
router.put("/geofences/:id", authenticateUser, updateGeofence);
router.delete("/geofences/:id", authenticateUser, deleteGeofence);
router.get("/geofences/:id", authenticateUser, getGeofenceById);
export default router;
