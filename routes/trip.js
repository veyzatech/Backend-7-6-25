// src/routes/tripRoutes.js
// src/routes/tripRoutes.js
import express from "express";
import { authenticateUser } from "../middlewares/userAuth.js";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  runStatusUpdate,
} from "../controllers/main/trips.js";

const router = express.Router();

router.post("/trips", authenticateUser, createTrip);
router.get("/trips", authenticateUser, getAllTrips);
router.get("/trips/:tripId", authenticateUser, getTripById);
router.put("/trips/:tripId", authenticateUser, updateTrip);
router.delete("/trips/:tripId", authenticateUser, deleteTrip);
router.get("/trips/update-status", authenticateUser, runStatusUpdate);


export default router;
