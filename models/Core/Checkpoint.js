import mongoose from "mongoose";

const checkpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name of the checkpoint
  },
  lat: {
    type: Number,
    required: true, // Latitude for the checkpoint center
  },
  long: {
    type: Number,
    required: true, // Longitude for the checkpoint center
  },
  radius: {
    type: Number,
    required: true, // Radius in meters or other distance units
    default: 80,
  },
  distance_unit: {
    type: String,
    enum: ["m", "km", "mi", "ft"], // Supported distance units
    required: true, // Unit of measurement for radius
    default: "m", // Default distance unit is meters
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Links the checkpoint to an account
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

checkpointSchema.index({ account_id: 1, name: 1 }, { unique: true });

// Middleware to update timestamps before saving (for new documents)
checkpointSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Middleware to update `updated_at` before updating an existing document
checkpointSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Middleware to update `updated_at` before updating multiple documents
checkpointSchema.pre("updateOne", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Middleware to update `updated_at` before updating many documents
checkpointSchema.pre("updateMany", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

const Checkpoint = mongoose.model("Checkpoint", checkpointSchema);

export default Checkpoint;
