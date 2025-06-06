import Route from "../../models/Core/Routes.js";

/**
 * Create a new route
 */
export const createRoute = async (req, res) => {
  try {
    const { name, source, destination, waypoints,scheduledAt } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Route name is required." });
    }
    if (!source || !destination) {
      return res
        .status(400)
        .json({ message: "Source and destination geofences are required." });
    }

    const newRoute = new Route({
      name,
      source,
      destination,
      waypoints: waypoints || [],
      scheduledAt
    });
    const savedRoute = await newRoute.save();

    res.status(201).json({
      message: "Route created successfully",
      route: savedRoute,
    });
  } catch (error) {
    console.error("Error creating route:", error);
    res
      .status(500)
      .json({ message: "Failed to create route", error: error.message });
  }
};

/**
 * Get all routes
 */
export const getAllRoutes = async (req, res) => {
  try {
    // Optionally populate geofence details
    const routes = await Route.find()
      .populate("source")
      .populate("destination")
      .populate("waypoints")
      .populate("scheduledAt");

    res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch routes", error: error.message });
  }
};

/**
 * Get a route by ID
 */
export const getRouteById = async (req, res) => {
  try {
    const { routeId } = req.params;
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required." });
    }

    // Optionally populate geofence details
    const route = await Route.findById(routeId)
      .populate("source")
      .populate("destination")
      .populate("waypoints");

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error("Error fetching route by ID:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch route", error: error.message });
  }
};

/**
 * Update a route
 */
export const updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required." });
    }

    const { name, source, destination, waypoints } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (source) updatedFields.source = source;
    if (destination) updatedFields.destination = destination;
    if (waypoints) updatedFields.waypoints = waypoints;

    const updatedRoute = await Route.findByIdAndUpdate(routeId, updatedFields, {
      new: true,
    })
      .populate("source")
      .populate("destination")
      .populate("waypoints");

    if (!updatedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json({
      message: "Route updated successfully",
      route: updatedRoute,
    });
  } catch (error) {
    console.error("Error updating route:", error);
    res
      .status(500)
      .json({ message: "Failed to update route", error: error.message });
  }
};

/**
 * Delete a route
 */
export const deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required." });
    }

    const deletedRoute = await Route.findByIdAndDelete(routeId);
    if (!deletedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res
      .status(500)
      .json({ message: "Failed to delete route", error: error.message });
  }
};
