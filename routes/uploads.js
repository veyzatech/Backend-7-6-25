// src/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 'uploads' folder must exist in your project root
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use current timestamp plus original extension for unique filenames
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// POST route to upload a file for a vehicle document.
// The file field name should be "documentFile".
router.post("/vehicle-document", upload.single("documentFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Construct a URL or file path based on your serving strategy.
  // For example, if you serve static files from the "uploads" folder:
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

export default router;
