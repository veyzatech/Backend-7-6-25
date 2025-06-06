import DailyStatus from "../../models/Production/dailyStatus.js";

export const getAllDailyStatuses = async (req, res) => {
  try {
    const statuses = await DailyStatus.find({});
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching daily statuses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
