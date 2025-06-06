import mongoose from "mongoose";

const geofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the geofence
  },
  lat: {
    type: Number,
    required: true, // Latitude for the geofence center
  },
  long: {
    type: Number,
    required: true, // Longitude for the geofence center
  },
  radius: {
    type: Number,
    required: true, // Radius in meters or other distance units
  },
  distance_unit: {
    type: String,
    enum: ["m", "km", "mi", "ft"], // Supported distance units
    required: true, // Unit of measurement for radius
    default: "m", // Default distance unit is meters
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Links the geofence to an account
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // Creation timestamp
  },
  updated_at: {
    type: Date,
    default: Date.now, // Update timestamp
  },
});

geofenceSchema.index({ account_id: 1, name: 1 }, { unique: true });

// Middleware to update timestamps before saving (for new documents)
geofenceSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Middleware to update `updated_at` before updating an existing document
geofenceSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Middleware to update `updated_at` before updating multiple documents
geofenceSchema.pre("updateOne", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Middleware to update `updated_at` before updating many documents
geofenceSchema.pre("updateMany", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

const Geofence = mongoose.model("Geofence", geofenceSchema);

export default Geofence;
