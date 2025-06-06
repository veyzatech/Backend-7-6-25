import axios from "axios";
import loconavMasterDataParse from "../../controllers/loconavMaster.js";
import { addToDatabase } from "../../controllers/locnavMongoInsertion.js";
import { addToDatabaseForMasterApi } from "../../controllers/deploymentFunctionCall/masterApiInsertion.js";
import { dataInsertionUnscheduledStoppage } from "../../controllers/deploymentFunctionCall/dailyStatusModelInsertion.js";

export const loconav = async (req, res, next) => {
  try {
    // Extract the auth_key from the request header
    const api_url = process.env.LOCONAV_API_URL;
    const { auth_key } = req.headers;

    if (!auth_key || !api_url) {
      return res
        .status(400)
        .json({ message: "auth_key and api_url are required." });
    }

    // Make a request to the external API with the auth_key in the header
    // const response = await axios.get(api_url, {
    //   headers: {
    //     "User-Authentication": auth_key,
    //     "Content-Type": "application/json",
    //   },
    // });

    // for (let item = 0; item < response.data.data.length; item++) {
    //   const parsedData = loconavMasterDataParse(response.data.data[item]);
    //   // console.log(parsedData);
    //   // addToDatabase(parsedData);
    //   addToDatabaseForMasterApi(parsedData);
    //   dataInsertionUnscheduledStoppage(parsedData);
    //   if (item==5) break;

    // }
    async function fetchWithRetry(api_url, auth_key, maxRetries = 20) {
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const response = await axios.get(api_url, {
            headers: {
              "User-Authentication": auth_key,
              "Content-Type": "application/json",
            },
            timeout: 20000 * 2, // Set timeout to 20 seconds (adjust as needed)
          });

          // If the response is not a 504, return it
          if (response.status !== 504) {
            return response;
          }

          console.log(`Received 504, retrying... Attempt ${attempt + 1}`);
        } catch (error) {
          // If the error status is not 504, rethrow the error
          if (error.response && error.response.status !== 504) {
            throw error;
          }

          console.log(
            `Error encountered: ${error.message}, retrying... Attempt ${
              attempt + 1
            }`
          );
        }

        attempt++;
        // Wait before retrying
        // await delay(5000); // 5 seconds delay before retrying
      }

      throw new Error(`Failed after ${maxRetries} attempts`);
    }
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms)); // A delay function
    }
    for (let i = 0; i <= 5; i++) {
      console.log(`Step: ${i}`);
      // await delay(60000); // Wait for 1 second before moving to the next step

      // response yaha par call karana hai
      // const response = await axios.get(api_url, {
      //   headers: {
      //     "User-Authentication": auth_key,
      //     "Content-Type": "application/json",
      //   },
      // });
      const response = await fetchWithRetry(api_url, auth_key);
      // console.log(response)
      // console.log("Bete chal gaya maja aa gaye")

      for (let item = 0; item < response.data.data.length; item++) {
        const parsedData = loconavMasterDataParse(response.data.data[item]);

        // console.log(parsedData);
        // addToDatabase(parsedData);
        // addToDatabaseForMasterApi(parsedData);
        dataInsertionUnscheduledStoppage(parsedData);
        // if (item == 15) break;
      }
      await delay(60000); // 1 min delay, delay has to provided into ms
      if (i == 15) i = 0;
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
