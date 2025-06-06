// src/controllers/main/tripController.js
import fetch from "node-fetch"; // or use global fetch on Node 18+
import mongoose from "mongoose";
import Trip from "../../models/Core/Trip.js";
import Vehicle from "../../models/Core/Vehicle.js";
import Driver from "../../models/Core/Driver.js";
import Geofence from "../../models/Core/Geofences.js";

// helper: point‑in‑circle test
function isInsideGeofence(lat, lng, centerLat, centerLng, radiusKm) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // earth radius km
  const dLat = toRad(centerLat - lat);
  const dLng = toRad(centerLng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) *
      Math.cos(toRad(centerLat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= radiusKm;
}

// ---- STATUS SYNC logic ----
async function checkAndUpdateTripStatuses() {
  // 1) fetch live locations
  const locRes = await fetch(
    "https://api.veyza.in/veyza-api/v0/get-live-location",
    { headers: { "Content-Type": "application/json" } }
  );
  if (!locRes.ok) throw new Error("Failed to fetch live locations");
  const liveLocations = await locRes.json();

  // 2) find trips that need updating
  const trips = await Trip.find({
    status: { $in: ["Not Started", "In Progress"] },
  }).populate("route");

  let updatedCount = 0;

  for (const trip of trips) {
    const live = liveLocations.find(
      (v) => v.vehicleNumber === trip.vehicle.number
    );
    if (!live) continue;

    // load start & dest geofences
    const startGeo = await Geofence.findById(trip.route.source);
    const destGeo = await Geofence.findById(trip.route.destination);
    if (!startGeo || !destGeo) continue;

    const { latitude, longitude } = live;
    const atStart = isInsideGeofence(
      latitude,
      longitude,
      Number(startGeo.lat),
      Number(startGeo.long),
      Number(startGeo.radius)
    );
    const atDest = isInsideGeofence(
      latitude,
      longitude,
      Number(destGeo.lat),
      Number(destGeo.long),
      Number(destGeo.radius)
    );

    if (trip.status === "Not Started" && atStart) {
      trip.status = "In Progress";
      trip.actualStartTime = new Date();
      await trip.save();
      updatedCount++;
    } else if (trip.status === "In Progress" && atDest) {
      trip.status = "Completed";
      trip.actualEndTime = new Date();
      await trip.save();
      updatedCount++;
    }
  }

  return updatedCount;
}

/**
 * GET /trips/update-status
 * Manually trigger a status sync pass.
 */
export const runStatusUpdate = async (req, res) => {
  try {
    const count = await checkAndUpdateTripStatuses();
    return res.json({
      message: "Trip status sync complete",
      updated: count,
    });
  } catch (err) {
    console.error("Error in status sync:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ---- CRUD Handlers ----

export const createTrip = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const {
      vehicle,
      driver,
      route,
      expected_distance,
      estimatedTripDuration,
      documents,
      status,
    } = req.body;

    // validation
    if (!vehicle?.id || !vehicle?.number)
      return res
        .status(400)
        .json({ message: "Vehicle id + number required" });
    if (!driver?.id || !driver?.name)
      return res
        .status(400)
        .json({ message: "Driver id + name required" });
    if (!route) return res.status(400).json({ message: "Route is required" });
    if (expected_distance == null)
      return res
        .status(400)
        .json({ message: "Expected distance is required" });
    if (estimatedTripDuration == null)
      return res
        .status(400)
        .json({ message: "Estimated trip duration is required" });

    // existence checks
    if (!(await Vehicle.findById(vehicle.id)))
      return res.status(404).json({ message: "Vehicle not found" });
    if (!(await Driver.findById(driver.id)))
      return res.status(404).json({ message: "Driver not found" });

    // build + save
    const trip = new Trip({
      vehicle: {
        id: new mongoose.Types.ObjectId(vehicle.id),
        number: vehicle.number,
      },
      driver: {
        id: new mongoose.Types.ObjectId(driver.id),
        name: driver.name,
      },
      route,
      expected_distance: Number(expected_distance),
      estimatedTripDuration: Number(estimatedTripDuration),
      documents: documents || [],
      status: status || "Not Started",
    });

    await trip.save();
    return res.status(201).json({ message: "Trip created", trip });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let trips;
    if (role === "Admin") {
      trips = await Trip.find()
        .populate("vehicle.id")
        .populate("driver.id")
        .populate("route");
    } else {
      trips = await Trip.find({ "vehicle.id.assignedUsers": userId })
        .populate("vehicle.id")
        .populate("driver.id")
        .populate("route");
      if (!trips.length)
        return res.status(404).json({ message: "No trips for this user" });
    }
    return res.json(trips);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching trips", error: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate("vehicle.id")
      .populate("driver.id")
      .populate("route");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    return res.json(trip);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching trip", error: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate("vehicle.id")
      .populate("driver.id")
      .populate("route");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const {
      expected_distance,
      estimatedTripDuration,
      documents,
      status,
      actualStartTime,
      actualEndTime,
    } = req.body;

    if (expected_distance != null) trip.expected_distance = Number(expected_distance);
    if (estimatedTripDuration != null)
      trip.estimatedTripDuration = Number(estimatedTripDuration);
    if (documents) trip.documents = documents;
    if (status) trip.status = status;
    if (actualStartTime) trip.actualStartTime = new Date(actualStartTime);
    if (actualEndTime) trip.actualEndTime = new Date(actualEndTime);

    await trip.save();
    return res.json({ message: "Trip updated", updatedTrip: trip });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating trip", error: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.tripId);
    return res.json({ message: "Trip deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting trip", error: error.message });
  }
};
