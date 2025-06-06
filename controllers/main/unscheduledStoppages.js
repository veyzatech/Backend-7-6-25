import LiveLocations from "../../models/Core/LiveLocation.js";
import { dataInsertionUnscheduledStoppage } from "../deploymentFunctionCall/dailyStatusModelInsertion.js";

async function calculateUnscheduledStoppages() {
  const getAllLiveLocation = await LiveLocations.find();
  getAllLiveLocation.forEach(async (element) => {
    await dataInsertionUnscheduledStoppage(element);
  });
}

export { calculateUnscheduledStoppages };
