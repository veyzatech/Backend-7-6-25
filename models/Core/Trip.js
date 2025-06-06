import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  vehicle: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    number: { type: String, required: true },
  },
  driver: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    name: { type: String, required: true },
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  expected_distance: { type: Number, required: true },
  estimatedTripDuration: { type: Number, required: true },    // NEW
  actualStartTime: { type: Date },                            // NEW
  actualEndTime: { type: Date },                              // NEW
  documents: [
    {
      docType: {
        type: String,
        enum: ["TripOrder", "TripConfirmation", "Other"],
        required: true,
      },
      fileUrl: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tripSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Trip", tripSchema);
