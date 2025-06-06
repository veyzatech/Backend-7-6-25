import {
  fetchAllDataLoconav,
  parseDate,
  formatLocationData,
  updateVehicleDocument,
} from "../../lib/utils.js";

const loconavAPIHandler = async (req, res) => {
  try {
    const baseUrl = process.env.LOCONAV_API_URL;
    const { auth_key } = req.headers;

    if (!auth_key) {
      return res.status(400).json({ message: "Auth key is required" });
    }

    // Fetch all data across multiple pages
    const vehiclesData = await fetchAllDataLoconav(baseUrl, auth_key);
    const updatedVehicles = [];

    for (const vehicle of vehiclesData) {
      const { number, device, subscription, additional_attributes } = vehicle;

      const vehicleNumber = number;

      // Store data or set missing fields to null
      const deviceSerialNumber = device?.serial_number || null;
      const devicePhoneNumber = device?.phone_number || null;
      const deviceType = device?.device_type || null;
      const subscriptionExpiresAt = subscription?.expires_at || null;
      const lastStatusReceivedAt = vehicle.last_status_received_at;

      // Parse the timestamp
      const timestamp = parseDate(lastStatusReceivedAt);

      // Format location data
      const locationData = formatLocationData(additional_attributes);

      // Update vehicle document, storing partial data if needed
      const vehicleDoc = await updateVehicleDocument(vehicleNumber, {
        vehicleNumber,
        deviceSerialNumber,
        devicePhoneNumber,
        deviceType,
        subscriptionExpiresAt,
        locationData,
      });

      updatedVehicles.push(vehicleDoc);
    }

    await Promise.all(updatedVehicles);

    return res.status(200).json({ message: "Data processed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing data" });
  }
};

export { loconavAPIHandler };
