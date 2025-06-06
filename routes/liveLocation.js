import express from "express";
import {
  //   deleteLiveLocation,
  fetchAndStoreLiveLocations,
  getAllLiveLocations,
  getLiveLocationByVehicle,
  searchLiveLocationByVehicleNumber,
} from "../controllers/main/liveLocation.js";

const router = express.Router();
// Route to fetch and store live locations from Loconav API
router.get("/fetch", fetchAndStoreLiveLocations);

// Route to get all stored live locations
router.get("/get-live-location", getAllLiveLocations);

// Route to get a specific vehicle's live location
router.get("/get-live-location/:vehicleNumber", getLiveLocationByVehicle);
router.get(
  "/live-location/search/:vehicleNumber",
  searchLiveLocationByVehicleNumber
);

// Route to delete a vehicle's live location
// router.delete("/:vehicleNumber", deleteLiveLocation);

export default router;
