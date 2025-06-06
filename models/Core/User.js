import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs"; // For password hashing

const userSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  user_id: {
    type: String,
    default: uuidv4, // Generates a UUID
    unique: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Operations"],
    required: true,
    default: "Operations",
  },

  // Reference to the Account the user belongs to
  // account_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Account",
  //   required: true,
  // },

  // Vehicles assigned to the user
  assigned_vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],

  status: {
    type: String,
    // enum: ["Active", "Inactive", "Suspended", "Pending"],
    // required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// ** Middleware: Hash password before saving **
userSchema.pre("save", async function (next) {
  this.updated_at = Date.now();

  // Prevent double hashing
  if (!this.isModified("password") || this.password.startsWith("$2a$"))
    return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ** Method: Compare password for login **
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
