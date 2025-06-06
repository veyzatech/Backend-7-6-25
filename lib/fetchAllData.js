import axios from "axios";
import masterApiModel from "../models/masterAPI.js";

// Helper function to fetch data
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

      // Use vehicleNumber as the unique identifier for upsert
      for (let item of fetchedData) {
        const mappedItem = { ...item, vehicleNumber: item.number }; // Map 'number' to 'vehicleNumber'
        delete mappedItem.number; // Remove the 'number' field if it's not needed

        try {
          await masterApiModel.updateOne(
            { vehicleNumber: mappedItem.vehicleNumber }, // Use vehicleNumber as unique identifier
            { $set: mappedItem }, // Set the document fields to the new data
            { upsert: true } // If record with this vehicleNumber doesn't exist, insert it
          );
          console.log(
            `Saved record with vehicleNumber: ${mappedItem.vehicleNumber}`
          );
        } catch (dbError) {
          console.error("Error saving record:", dbError);
        }
      }

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

export { fetchAllDataLoconav };
