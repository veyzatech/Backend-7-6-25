import mongoose, { Schema } from "mongoose";

const tripSchema = new Schema({
  vehicleNo: {
    type: String,
    required: true,
    unique: true,
  },
  routeDetail: {
    type: String,
    required: false,
    trim: true,
  },
  startingGeofence : {
    type: String,   // this will store id of starting geofence
    required : false,
  },
  endingGeofence : {
    type: String,  // this will store id of ending geofence
    required : false
  },
  checkPoints: {  // this will store the list of all the check points
    type: [String],
    default: [],
    required: false
  },
  tripStatus: {
    type: String,
    enum: ["Completed", "In Progress", "Scheduled"],
    required: true,
  },
  startInfo: {
    type: Date,
    required: true,
    default: new Date(),
  },
  eta: {
    type: Date,
    required: false,
  },
  distance: {
    type: Number,
    required: false,
  },
  fuel: {
    type: Number,
    required: false,
  },
});

const tripStatus = mongoose.model("tripStatus", tripSchema);

export default tripStatus;
