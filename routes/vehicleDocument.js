import express from "express";
import {
  createVehicleDocument,
  getAllVehicleDocuments,
  getVehicleDocumentById,
  updateVehicleDocument,
  deleteVehicleDocument,
  upload
} from "../controllers/main/vehicleDocument.js";

const router = express.Router();

// For creating a vehicle document, use multer middleware to handle single file upload.
// The field name must match what multer expects; here we use "docFile".
router.post('/upload/vehicle-document', upload.single('docFile'), createVehicleDocument);

router.get('/vehicle-documents', getAllVehicleDocuments);
router.get('/vehicle-documents/:id', getVehicleDocumentById);
router.put('/vehicle-documents/:id', updateVehicleDocument);
router.delete('/vehicle-documents/:id', deleteVehicleDocument);

export default router;