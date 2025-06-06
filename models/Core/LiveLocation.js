//last location
// number
// status
// location
// lat,long
// last updated(timestamp)

import mongoose from "mongoose";

const liveLocationSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true, // Ensuring each vehicle number is unique
  },
  status: {
    type: String,
    // enum: ["moving", "stopped", "idle", "offline"], // Possible statuses
    // required: true,
  },
  location: {
    type: String,
    required: true, // e.g., "Delhi, India"
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  lastPacketReceivedAt: {
    type: Date,
    required: true,
  },
  device:{
    type: String,
  },
  deviceNumber:{
    type: String,
  },
});

const LiveLocations = mongoose.model("LiveLocations", liveLocationSchema);

export default LiveLocations;
