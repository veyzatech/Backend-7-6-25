import axios from "axios";
import moment from "moment";
import masterApiModel from "../models/masterAPI.js";

// Helper function to fetch all data from Loconav API with pagination
const fetchAllDataLoconav = async (baseUrl, auth_key) => {
  let page = 1;
  let allData = [];

  while (true) {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set("page", page);

      const response = await axios.get(url.toString(), {
        headers: {
          "User-Authentication": auth_key,
          "Content-Type": "application/json",
        },
      });

      if (
        !response.data ||
        !Array.isArray(response.data.data) ||
        response.data.data.length === 0
      ) {
        console.log("No more data to fetch.");
        break;
      }

      const fetchedData = response.data.data;
      allData.push(...fetchedData);

      console.log(
        `Fetched page ${page}, total items so far: ${allData.length}`
      );
      page++;
    } catch (error) {
      console.error("Error fetching data:", error);
      break;
    }
  }

  return allData;
};

// Helper function to parse the date format and handle invalid dates
const parseDate = (dateStr) => {
  const timestamp = moment(dateStr, "DD/MM/YYYY, hh:mmA").toDate();
  if (!timestamp || isNaN(timestamp)) {
    console.error(`Invalid date format: ${dateStr}`);
    return new Date(); // Return current date if invalid
  }
  return timestamp;
};

// Helper function to format the location data
const formatLocationData = (additionalAttributes) => {
  const location = additionalAttributes?.movement_metrics?.location || {};
  const lat = location.lat || 0;
  const lng = location.long || 0;
  const lastLocation = location.address || "Unknown";

  return {
    locationAt: lastLocation,
    timestamp: new Date(), // Default to current time
    lat,
    lng,
    speed: additionalAttributes?.movement_metrics?.speed?.value || "N/A",
    gpsStatus: additionalAttributes?.movement_metrics?.motion_status || "N/A",
    motionStat: additionalAttributes?.movement_metrics?.motion_status,
  };
};

// Helper function to update the vehicle document in the database
const updateVehicleDocument = async (vehicleNumber, vehicleData) => {
  const vehicleDoc = await masterApiModel.findOneAndUpdate(
    { vehicleNumber },
    {
      $set: vehicleData,
      $push: { locations: vehicleData.locationData },
    },
    { new: true, upsert: true }
  );

  return vehicleDoc;
};

export {
  fetchAllDataLoconav,
  parseDate,
  formatLocationData,
  updateVehicleDocument,
};
