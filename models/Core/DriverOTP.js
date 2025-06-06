
import mongoose, { Schema } from "mongoose";

const driverOTPSchema = new Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  verification_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: true,
  },
  retry_count: {
    type: Number,
    default: 0,
  },
});

const DriverOTP = mongoose.model("DriverOTP", driverOTPSchema);
export default DriverOTP;
