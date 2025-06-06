import VehicleDocument from "../../models/Core/vehicleDocuments.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage to store files in a local 'uploads' directory.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure this path exists (create an 'uploads' folder in your project root if needed)
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    // Create a unique filename using a timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

export const upload = multer({ storage });

// ====================================================================
// Controller Functions
// ====================================================================

export const createVehicleDocument = async (req, res) => {
  try {
    // Multer will store the file and attach file details to req.file
    const { vehicle, documentType, issuedDate, expiryDate, uploadedBy, reminderSettings } = req.body;
    
    // Check that a file was uploaded by verifying req.file.
    if (!req.file) {
      return res.status(400).json({ message: "Missing file upload for 'docFile'" });
    }

    // Generate a fileUrl.
    // Optionally, set a BASE_URL environment variable (e.g. http://localhost:4000)
    const baseUrl = process.env.BASE_URL || '';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Validate that all required fields are provided.
    if (!vehicle || !documentType || !fileUrl || !expiryDate) {
      return res.status(400).json({
        message: "Missing required fields: vehicle, documentType, fileUrl, or expiryDate"
      });
    }
    
    console.log("Creating vehicle document with data:", {
      vehicle,
      documentType,
      fileUrl,
      issuedDate,
      expiryDate,
      uploadedBy,
      reminderSettings
    });

    const newDocument = new VehicleDocument({
      vehicle,
      documentType,
      fileUrl,
      issuedDate: issuedDate || null,
      expiryDate,
      uploadedBy: uploadedBy || null,
      // If reminderSettings is passed as a string (from form-data), attempt to parse it.
      reminderSettings: reminderSettings ? JSON.parse(reminderSettings) : {},
      triggeredReminders: [],
    });

    const savedDocument = await newDocument.save();
    res.status(201).json({ message: "Vehicle document created successfully", document: savedDocument });
  } catch (error) {
    console.error("Error creating vehicle document:", error);
    res.status(500).json({ message: "Error creating vehicle document", error: error.message });
  }
};

export const getAllVehicleDocuments = async (req, res) => {
  try {
    const documents = await VehicleDocument.find()
      .populate("vehicle")
      .populate("uploadedBy");
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching vehicle documents:", error);
    res.status(500).json({ message: "Error fetching vehicle documents", error: error.message });
  }
};

export const getVehicleDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await VehicleDocument.findById(id)
      .populate("vehicle")
      .populate("uploadedBy");
    if (!document) {
      return res.status(404).json({ message: "Vehicle document not found" });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error("Error fetching vehicle document:", error);
    res.status(500).json({ message: "Error fetching vehicle document", error: error.message });
  }
};

export const updateVehicleDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedDocument = await VehicleDocument.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDocument) {
      return res.status(404).json({ message: "Vehicle document not found" });
    }
    res.status(200).json({ message: "Vehicle document updated successfully", document: updatedDocument });
  } catch (error) {
    console.error("Error updating vehicle document:", error);
    res.status(500).json({ message: "Error updating vehicle document", error: error.message });
  }
};

export const deleteVehicleDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDocument = await VehicleDocument.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({ message: "Vehicle document not found" });
    }
    res.status(200).json({ message: "Vehicle document deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle document:", error);
    res.status(500).json({ message: "Error deleting vehicle document", error: error.message });
  }
};