import express from "express";
import { authenticateUser } from "../middlewares/userAuth.js";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from "../controllers/main/routeController.js";

const router = express.Router();

// Create a new route
router.post("/routes/create-route", authenticateUser, createRoute);

// Get all routes
router.get("/routes",authenticateUser, getAllRoutes);

// Get a route by ID
router.get("/routes/:routeId",authenticateUser, getRouteById);

// Update a route
router.put("/routes/:routeId", authenticateUser,updateRoute);

// Delete a route
router.delete("/routes/:routeId",authenticateUser, deleteRoute);

export default router;
