function convertTimestampToLocalDate(timestamp) {
  if (!timestamp) return; // Handle undefined or null timestamps
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  // return  date.toLocaleString(); // Return the date in local format
  return date;
}
// Function to process the API response

const loconavMasterDataParse = (data) => {
  try {
    // Validate the response structure
    if (!data) {
      throw new Error("Invalid response data format.");
    }

    // Extract required fields from the response
    const gpsStatus = data.gps_status || "N/A";
    let status = "N/A";
    let since = "N/A";
    if (gpsStatus.includes("since")) {
      const parts = gpsStatus.split("since");
      status = parts[0].trim();
      since = parts[1]?.trim() || "N/A";
    }

    const requiredFields = {
      id: data?.id || "NAN",
      number: data?.number || "NAN",
      currentTemperature: data?.current_temperature || "NAN",
      status: status,
      since: since,
      lastLocatedAt:
        convertTimestampToLocalDate(data?.last_located_at) || new Date(),
      lastLocation: data?.last_location || "NAN",
      lastStatusReceivedAt: data?.last_status_received_at || "NAN",
      statusMessageReceivedAt: data?.status_message?.received_at || "NAN",

      deviceSerialNumber: data?.device?.serial_number || "NAN",
      deviceCountryCode: data?.device?.country_code || "NAN",
      devicePhoneNumber: data?.device?.phone_number || "NAN",
      deviceType: data?.device?.device_type || "NAN",

      subscriptionExpiresAt: data?.subscription?.expires_at || none,

      movementOrientation:
        data?.additional_attributes?.movement_metrics?.orientation || "NAN",
      movementSpeedValue:
        data?.additional_attributes?.movement_metrics?.speed?.value || "NAN",
      movementSpeedUnit:
        data?.additional_attributes?.movement_metrics?.speed?.unit || "NAN",
      movementLat: data?.additional_attributes?.movement_metrics?.location?.lat,
      movementLong:
        data?.additional_attributes?.movement_metrics?.location?.long, //360 is invalid
      movementAddress:
        data?.additional_attributes?.movement_metrics?.location?.address ||
        "NAN",
      movementReceivedTs:
        data?.additional_attributes?.movement_metrics?.location?.received_ts ||
        "NAN",
      motionStatus:
        data?.additional_attributes?.movement_metrics?.motion_status || "NAN",
      motionStateSinceTs:
        data?.additional_attributes?.movement_metrics?.state_since_ts || "NAN",
      ignitionStatus:
        data?.additional_attributes?.movement_metrics?.ignition || "NAN",

      currentOdometerReading: data?.current_odometer_reading || 0,
      chassisNumber: data?.chassis_number || "NAN",
      displayNumber: data?.display_number || "NAN",
      createdAt: convertTimestampToLocalDate(data?.created_at) || null,
      updatedAt: convertTimestampToLocalDate(data?.updated_at) || null,
    };

    //return parsed data
    // console.log(`status received at ${typeof requiredFields.statusMessageReceivedAt}`)
    // console.log(`last status received at ${typeof requiredFields.lastStatusReceivedAt}`)
    // console.log(`subscritption exp at ${typeof requiredFields.subscriptionExpiresAt}`)
    // console.log(`created at ${typeof requiredFields.createdAt}`)
    // console.log(`updated at ${typeof requiredFields.updatedAt}`)
    console.log(requiredFields);
    return requiredFields;
  } catch (error) {
    console.error("Error processing API response:", error.message);
    return { error: "Failed to process response data." };
    process.exit(1);
  }
};
export default loconavMasterDataParse;
