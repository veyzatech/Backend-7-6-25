import express from "express";

import { authenticateUser } from "../middlewares/userAuth.js";
import { createCheckpoint, deleteCheckpoint, getCheckpointById, getCheckpointForUser, updateCheckpoint } from "../controllers/main/checkpoint.js";

const router = express.Router();
router.post("/create-checkpoint", authenticateUser, createCheckpoint);
router.get("/checkpoint", authenticateUser, getCheckpointForUser);
router.put("/checkpoint/:id", authenticateUser, updateCheckpoint);
router.delete("/checkpoint/:id", authenticateUser, deleteCheckpoint);
router.get("/checkpoint/:id", authenticateUser, getCheckpointById);
export default router;
