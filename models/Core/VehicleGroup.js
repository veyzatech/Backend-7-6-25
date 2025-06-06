import mongoose from "mongoose";

const vehicleGroupSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    unique: true,
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Links the group to an account
    required: true,
  },
  group_name: { type: String, required: true, unique: true }, // Name of the vehicle group
  group_type: {
    type: String,
    enum: ["Fleet", "Region", "Department", "Custom"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle", // Vehicles assigned to this group
    },
  ],
  assigned_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Users managing this group
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// ** Middleware: Update timestamps before saving **
vehicleGroupSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const VehicleGroup = mongoose.model("VehicleGroup", vehicleGroupSchema);

export default VehicleGroup;
