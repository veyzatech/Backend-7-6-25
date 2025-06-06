// import axios from "axios";
// import loconavMasterDataParse from "../../controllers/loconavMaster.js";
// import { addToDatabase } from "../../controllers/locnavMongoInsertion.js";
// import { addToDatabaseForMasterApi } from "../../controllers/deploymentFunctionCall/masterApiInsertion.js";
import { dataInsertionUnscheduledStoppage } from "../../controllers/deploymentFunctionCall/dailyStatusModelInsertion.js";
import { parseDate } from "../../lib/utils.js";
// import dailyStatus from "../../models/Production/dailyStatus.js";

export const test = async (req, res, next) => {
  try {
    const parseDate={
        id: 838705,
        number: 'MH03DV9894',
        currentTemperature: 'N/A',
        status: 'Stopped',
        since: '02:37 PM',
        lastLocation: '704, Lal Bahadur Shastri Rd, Vasant Oscar, Mulund West, Mumbai, Maharashtra 400080, India',
        lastStatusReceivedAt: '04/02/2025, 02:37PM',
        statusMessageReceivedAt: '04/02/2025, 03:02PM',
        deviceSerialNumber: '0867440069409332',
        deviceCountryCode: 'IN',
        devicePhoneNumber: '5754226197348',
        deviceType: 'Concox-V5',
        subscriptionExpiresAt: '2026-01-20T21:17:29.000+05:30',
        movementOrientation: 45,
        movementSpeedValue: 'NAN',
        movementSpeedUnit: 'km/h',
        movementLat: 19.167548,
        movementLong: 72.940721,
        movementAddress: '704, Lal Bahadur Shastri Rd, Vasant Oscar, Mulund West, Mumbai, Maharashtra 400080, India',
        movementReceivedTs: 1738660176,
        motionStatus: 'idiling',
        motionStateSinceTs: 1738660020,
        ignitionStatus: 'off',
        currentOdometerReading: 0,
        chassisNumber: 'NAN',
        displayNumber: 'MH03DV9894',
      }
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms)); // A delay function
    }


    for (let i = 0; i < 10; i++) {
        dataInsertionUnscheduledStoppage(parseDate);
        await delay(60000/8);
        if(i==4) parseDate.motionStatus="baby"
    }

      

    // Return the API response
    return res.status(200).json({
      message: "API call successful",
      // data: response.data,
      // data: parsedData,
    });
  } catch (error) {
    console.error("Error making API call:", error.message);

    // Handle errors gracefully
    if (error.response) {
      // API responded with an error status code
      return res.status(error.response.status).json({
        message: "API call failed",
        error: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response received
      return res.status(500).json({
        message: "No response received from the API",
        error: error.message,
      });
    } else {
      // Something else happened
      return res.status(500).json({
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
};

// setInterval(loconav, 5000);
