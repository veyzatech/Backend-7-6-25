import express from "express";
import { getAllDailyStatuses } from "../controllers/main/dailyStatus.js";
// import { dataInsertionUnscheduledStoppage } from "../lib/Deployment Function call/dailyStatusModelInsertion.js";

const router = express.Router();
// router.get("/tracking-unscheduled-stoppage",dataInsertionUnscheduledStoppage );
router.get("/dailyStatus", getAllDailyStatuses);

export default router;
