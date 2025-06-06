import mongoose, { Schema } from "mongoose";

const vehicleDocumentSchema = new Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  // Reminder settings: users can choose which methods and frequencies for alerts.
  reminderSettings: {
    // Methods can be any strings like "email", "whatsapp"; you can store an array.
    reminderMethods: [{ type: String }],
    // Contact details for alerts.
    reminderEmail: { type: String },
    reminderWhatsApp: { type: String },
    // Frequencies (in days before expiry) when alerts should be sent.
    reminderFrequencies: [{ type: Number }], // e.g., [30, 7] means alerts 30 days and 7 days before expiry
  },
  // Keep track of which reminder frequencies have already been triggered to avoid duplicate alerts.
  triggeredReminders: [{ type: Number }],
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
  },
  updatedAt: { 
    type: Date, 
    default: Date.now,
  },
});

vehicleDocumentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const VehicleDocument = mongoose.model("VehicleDocument", vehicleDocumentSchema);
export default VehicleDocument;
