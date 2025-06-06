import LiveLocation from "../../models/Core/LiveLocation.js"; // Ensure correct model name
import axios from "axios";
import dotenv from "dotenv";
import { parseLoconavDate } from "../../lib/loconavDate.js";

dotenv.config();

// Helper function to fetch data from pages in Loconav api
const fetchAllPages = async () => {
  let allData = [];
  let page = 1;

  try {
    while (true) {
      const url = LOCONAV_API_URL.replace(/page=\d+/, `page=${page}`); // Update page dynamically
      console.log(`Fetching: ${url}`);

      const response = await axios.get(url, {
        headers: {
          "User-Authentication": LOCONAV_AUTH_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.data?.data || response.data.data.length === 0) {
        console.log(`No more data at page ${page}`);
        break; // Stop fetching if no more data
      }

      allData.push(...response.data.data);
      page++; // Move to the next page
    }

    console.log(`Total records fetched: ${allData.length}`);
    return allData;
  } catch (error) {
    console.error(`Error fetching data:`, error.message);
    return [];
  }
};

//Helper function to fetch data via vehicle number from loconav api
const fetchVehicleData = async (vehicleNumber) => {
  try {
    const LOCONAV_API_URL = process.env.LOCONAV_API_URL;
    const LOCONAV_AUTH_KEY = process.env.LOCONAV_AUTH_KEY;

    console.log(`Fetching data for vehicle: ${vehicleNumber}`);

    // Loconav request (uses vehicle number)
    const loconavUrl = `${LOCONAV_API_URL}&number=${vehicleNumber}`;
    const response = await axios.get(loconavUrl, {
      headers: {
        "User-Authentication": LOCONAV_AUTH_KEY,
        "Content-Type": "application/json",
      },
    });

    // Process Loconav data
    const loconavData =
      response.data?.data?.length > 0 ? response.data.data[0] : null;

    if (!loconavData) {
      console.log(`No Loconav data found for vehicle: ${vehicleNumber}`);
      return null;
    }

    return loconavData;
  } catch (error) {
    console.error(
      `Error fetching Loconav data for vehicle ${vehicleNumber}:`,
      error.message
    );
    return null;
  }
};

// Function to fetch Fleetx data
const fetchFleetxData = async () => {
  try {
    const FLEETX_API_URL = process.env.FLEETX_API_URL;
    const FLEETX_AUTH_KEY = process.env.FLEETX_AUTH_KEY;

    const response = await fetch(FLEETX_API_URL, {
      method: "GET",
      headers: {
        Authorization: `bearer ${FLEETX_AUTH_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching Fleetx data:", error);
    return null;
  }
};

// Main function to fetch and store all live locations
export const fetchAndStoreLiveLocations = async (req, res) => {
  try {
    // Vehicle numbers for Loconav
    const vehicleNumbers = ["GJ15YY6602", "GJ15YY6603"];

    // Fetch data from Loconav API
    const loconavData = await Promise.all(vehicleNumbers.map(fetchVehicleData));

    // Fetch data from Fleetx API
    const fleetxData = await fetchFleetxData();

    const bulkOperations = [];

    // Process Loconav data
    loconavData.forEach((vehicle) => {
      if (
        vehicle.number &&
        !vehicle.gps_status.toLowerCase().includes("no device")
      ) {
        const receivedAt = vehicle.status_message.received_at;
        const validDate = receivedAt ? parseLoconavDate(receivedAt) : null;

        bulkOperations.push({
          updateOne: {
            filter: { vehicleNumber: vehicle.number },
            update: {
              $set: {
                status: vehicle.gps_status,
                location: vehicle.last_location || "Unknown",
                latitude:
                  vehicle.additional_attributes?.movement_metrics?.location
                    ?.lat ?? null,
                longitude:
                  vehicle.additional_attributes?.movement_metrics?.location
                    ?.long ?? null,
                lastPacketReceivedAt: validDate,
                provider: "Loconav",
                device: vehicle.device.serial_number,
                deviceNumber: vehicle.device.phone_number
              },
            },
            upsert: true,
          },
        });
      }
    });

    // Process Fleetx data
    if (fleetxData?.vehicles?.length) {
      fleetxData.vehicles.forEach((vehicle) => {
        bulkOperations.push({
          updateOne: {
            filter: { vehicleNumber: vehicle.vehicleNumber },
            update: {
              $set: {
                status: vehicle.currentStatus,
                location: vehicle.address || "Unknown",
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
                lastPacketReceivedAt: new Date(vehicle.lastUpdatedAt),
                device: vehicle.deviceId,
                deviceNumber: vehicle.otherAttributes.imei,// Convert timestamp to date
                provider: "Fleetx",
              },
            },
            upsert: true,
          },
        });
      });
    }

    // Perform bulk write if there are operations
    if (bulkOperations.length > 0) {
      await LiveLocation.bulkWrite(bulkOperations);
      console.log("Live locations updated successfully");
    } else {
      console.log("No valid vehicle data to process");
    }

    return res.status(200).json({ message: "Data processed successfully" });
 // } catch (error) {
  //  console.error("Error fetching and storing data:", error);
    // return res.status(500).json({ error: "Internal Server Error" });
  //}
  } catch (error) {
  console.error("Error fetching and storing data:", error);
  // Return false or null to indicate failure
  return null;
}

};

//get all live loc
export const getAllLiveLocations = async (req, res) => {
  try {
    const locations = await LiveLocation.find();

    if (locations.length === 0) {
      return res.status(404).json({ message: "No live locations found" });
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching live locations:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getLiveLocationByVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const location = await LiveLocation.findOne({ vehicleNumber });

    if (!location) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Error fetching vehicle location:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteLiveLocation = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const deletedLocation = await LiveLocation.findOneAndDelete({
      vehicleNumber,
    });

    if (!deletedLocation) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Live location deleted successfully" });
  } catch (error) {
    console.error("Error deleting live location:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//function to search vehilce by its number with regex
export const searchLiveLocationByVehicleNumber = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    if (!vehicleNumber) {
      return res.status(400).json({ message: "Vehicle number is required" });
    }

    // Using case-insensitive regex to find partial matches
    const vehicle = await LiveLocation.findOne({
      vehicleNumber: { $regex: new RegExp(vehicleNumber, "i") },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error searching for vehicle:", error);
    res
      .status(500)
      .json({ message: "Failed to search for vehicle", error: error.message });
  }
};
