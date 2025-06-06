import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique account_id

const accountSchema = new mongoose.Schema(
  {
    account_id: {
      type: String,
      default: uuidv4, // Generates a UUID
      unique: true,
    },
    account_name: {
      type: String,
      required: true, // Main user's name
    },
    account_type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Pending"],
      required: true,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    subscription_plan: {
      type: String,
      required: true,
    },
    subscription_start_date: {
      type: Date,
    },
    subscription_end_date: {
      type: Date,
    },
    billing_cycle: {
      type: String,
    },

    // Owner of the account (Main User)
    account_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    account_owner_uuid: {
      type: String,
      required: true,
    },

    // Contact details
    primary_contact_name: { type: String, required: true },
    primary_contact_email: { type: String, required: true },
    primary_contact_phone: { type: String, required: true },

    // Business Details
    company_size: { type: String },
    industry: { type: String },
    website: { type: String },
    logo_url: { type: String },

    // Address & Billing
    billing_address: { type: String },
    shipping_address: { type: String },
    tax_id: { type: String },
    payment_method: {
      type: String,
      // enum: ["Credit Card", "Bank Transfer", "PayPal"],
      // required: true,
    },
    credit_limit: { type: mongoose.Schema.Types.Decimal128 },
    account_balance: { type: mongoose.Schema.Types.Decimal128 },
    last_invoice_date: { type: Date },
    next_invoice_date: { type: Date },

    // Vehicles owned by the main user
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle", // Assumes a separate Vehicle model
      },
    ],

    // Sub-users linked to this account
    sub_users: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Links to the User model
        },
        assigned_vehicles: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle", // Only specific vehicles assigned to the subuser
          },
        ],
      },
    ],
  },
  { strict: false }
);

// Middleware to update timestamps before saving
accountSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
