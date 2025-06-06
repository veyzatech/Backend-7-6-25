import mongoose, { Schema } from "mongoose";

const masterApiModelSchema = new Schema({
  vehicleNumber: {
    // Primary key
    type: String,
    required: true,
    unique: true, // Ensures uniqueness for the primary key
  },
  locations: [
    {
      locationAt: { type: String, required: false },
      timestamp: { type: Date, required: true }, // api received at
      temperature: { type: String, required: false },
      gpsStatus: { type: String, required: false },
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
      speed: { type: String, required: false },
      speedLocation: { type: String, required: false },
      odoMeterReading: { type: Number, required: false },
      gpsStatusLastUpdated: { type: String, required: false },
      lastStatusReceivedAt: { type: String, required: false },
      ignition: { type: String, required: false },
      motionStat: { type: String, required: false },
    },
  ],
  deviceSerialNumber: {
    type: String,
    required: false,
  },
  devicePhoneNumber: {
    type: String,
    required: false,
  },
  deviceType: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  subscriptionExpiresAt: {
    type: String,
    required: true, // Ensures this field is not null
  },
});

const masterApiModel = mongoose.model("masterApiModel", masterApiModelSchema);

export default masterApiModel;
