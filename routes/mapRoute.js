import express from "express";
import {
  getAllVehiclesLastLocation,
  /*
  fetchVehicleLocations,*/ getLastLocation,
} from "../controllers/deploymentFunctionCall/mapView.js";

const router = express.Router();
router.get("/get-vehicle-locations", getAllVehiclesLastLocation);
export default router;
