import express from "express";
import { loconav } from "../controllers/loconav/allData.js";
import { loconavAPIHandler } from "../controllers/loconav/apiDataHandler.js";
import { test } from "../controllers/loconav/test.js";
// import verifyAuth from "../middlewares/userAuth.js";

// import {
//   getAllVehiclesLocations,
//   getVehicleLocation,
// } from "../controllers/loconav/retrieveData.js";

const router = express.Router();
router.get("/loconav", /*verifyAuth,*/ loconav);
router.get("/test", /*verifyAuth,*/ test);

// router.get("/all-vehicles-location-loconav", getAllVehiclesLocations);
// router.get("/vehicle-location-loconav/:vehicleNumber", getVehicleLocation);

// just to test the functions working
router.get("/loconav-test", loconavAPIHandler);

export default router;
