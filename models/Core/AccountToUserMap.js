import mongoose from "mongoose";

const accountUserMappingSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Reference to the Account model
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  role_in_account: {
    type: String,
    enum: ["Owner", "Manager", "Operator", "Viewer"], // Different roles for users in the account
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// ** Middleware: Update timestamps before saving **
accountUserMappingSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const AccountUserMapping = mongoose.model(
  "AccountUserMapping",
  accountUserMappingSchema
);

export default AccountUserMapping;
