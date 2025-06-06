import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema({
  // The account that owns this driver profile
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  // A separate, unique driver ID (auto-generated via pre-validate hook)
  driverId: {
    type: String,
    required: true,
    unique: true,
  },
  driverName: {
    type: String,
    required: true,
    trim: true,
  },
  // Mobile field replaces contact with 10-digit validation and uniqueness
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid 10-digit mobile number!`,
    },
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
  },
  dlNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  dlIssueDate: {
    type: Date,
    required: false,
  },
  dlExpiryDate: {
    type: Date,
    required: false,
  },
  // New fields for salary and variable pay
  base_salary: {
    type: Number,
    required: true,
  },
  variablePay: {
    type: Number,
    required: true,
  },
  // New bank_details object for the driver's bank information
  bank_details: {
    account_no: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
  },
  // Documents array for driver-related files (license, ID proof, etc.)
  documents: {
    type: [
      {
        docType: {
          type: String,
          enum: ["license", "idProof", "other"],
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        // Optional metadata for file uploads
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  // assigned_users now references Account(s)
  assigned_users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Account",
    default: [],
  },
});

// Pre-validate hook to auto-generate driverId if not provided
driverSchema.pre("validate", function (next) {
  if (!this.driverId) {
    this.driverId = "DRIVER-" + Date.now();
  }
  next();
});

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
