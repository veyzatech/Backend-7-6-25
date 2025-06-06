import mongoose from "mongoose";

const deviceInfoSchema = new mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle", // Links device info to a vehicle
    required: true,
  },
  gps_provider: {
    type: String,
    required: true,
  }, // GPS provider (e.g., Loconav, FleetX, etc.)
  gps_device_id: {
    type: String,
    required: true,
    unique: true,
  }, // Unique GPS tracker ID for this device
  device_type: {
    type: String,
    enum: ["GPS Tracker", "Mobile Device", "Other"],
    required: true,
  },
  last_sync_time: {
    type: Date,
    default: Date.now,
  }, // Last time this device's data was synced
  battery_status: {
    type: String,
    enum: ["Full", "Charging", "Low", "Critical"],
    required: true,
  }, // Battery status of the device
  connection_status: {
    type: String,
    enum: ["Active", "Inactive", "Error"],
    required: true,
  }, // Device connection status
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update timestamps
deviceInfoSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const DeviceInfo = mongoose.model("DeviceInfo", deviceInfoSchema);

export default DeviceInfo;
