import { fetchAndStoreLiveLocations } from "../controllers/main/liveLocation.js";
import { calculateUnscheduledStoppages } from "../controllers/main/unscheduledStoppages.js";

const startLiveLocationScheduler = async () => {
  console.log("Live location scheduler started...");

  // Run immediately on server startup
  await fetchAndStoreLiveLocations();
  // here will go the call for counting unscheduled stoppage
  await calculateUnscheduledStoppages();
  // Run every 5 minutes
  setInterval(async () => {
    try {
      console.log("Fetching live locations...");
      await fetchAndStoreLiveLocations();
      console.log("************************************");
      await calculateUnscheduledStoppages();
      console.log("Live locations updated successfully.");
    } catch (error) {
      console.error("Error in scheduled live location fetch:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
};

export default startLiveLocationScheduler;
