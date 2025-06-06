import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Geofence",
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Geofence",
    required: true,
  },
  // Optional: An array of additional geofence waypoints
  waypoints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Geofence",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  scheduledAt:{
    type: Date,
    required: false,
  }
});

const Route = mongoose.model("Route", routeSchema);
export default Route;
