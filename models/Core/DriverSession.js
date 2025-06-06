import mongoose, { Schema } from "mongoose";

const driverSessionSchema = new Schema({
  session_id: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  logged_in_at: {
    type: Number,
    required: true,
  },
  logged_out_at: {
    type: Number,
  },
  auth_token: {
    type: String,
    required: true,
  },
});

const DriverSession = mongoose.model("DriverSession", driverSessionSchema);
export default DriverSession;
