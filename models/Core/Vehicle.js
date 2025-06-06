import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      default: uuidv4, // Generates a UUID
      unique: true,
    },
    // accountId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Account", // Links the vehicle to an account
    //   required: true,
    // },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users assigned to manage this vehicle
      },
    ],
    vehicleNumber: { type: String, required: true, unique: true }, // License plate number
    make: { type: String, required: true }, // Vehicle brand
    model: { type: String, required: true }, // Vehicle model
    year: { type: Number, required: true }, // Manufacturing year
    type: {
      type: String,
      enum: ["Truck", "Van", "Bike", "Car", "Bus", "Trailer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance", "Out of Service"],
      required: true,
    },
    gpsProvider: { type: String, required: true }, // e.g., Loconav, FleetX, etc.
    // gpsDeviceId: { type: String, required: true, unique: true }, 
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true,
    },
    capacity: { type: Number, required: true }, // Capacity in tons/liters
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    registrationDate: { type: Date, required: true },
    lastServiceDate: { type: Date },
    nextServiceDue: { type: Date },

    // Device info linked to this vehicle
    device: {
      type: String
    },
    deviceID: {
      type: String
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

// Middleware: Update timestamps before saving
vehicleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
