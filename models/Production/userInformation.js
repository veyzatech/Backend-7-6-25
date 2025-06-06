import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true, trim: true },
  userArray: [{ _id: { type: String, required: true } }],
  userEmailID: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: String, required: true },
  authkey: { type: String, required: false },
  assignedRole: {
    type: String,
    enum: ["Super Admin", "Admin"],
    required: false,
    default: "Admin",
  },
  visibleVechile: [
    {
      _id: { type: String, required: true },
      vehicleNumber: { type: Number, required: true },
    },
  ],
});

const userInformation = mongoose.model("Users", userSchema);

export default userInformation;
