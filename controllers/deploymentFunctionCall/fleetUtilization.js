import dailyStatus from "../../models/Production/dailyStatus.js";

async function fetchFleetUtilizationData() {
  try {
    const data = await dailyStatus.find({});

    // Print the data
    console.log("All data in dailyRunningKM collection:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//  *************************************************************
//                  below is reference how this data will be sended to front end
//*****************************************************************

// // Import necessary modules
// import express from "express";
// import mongoose from "mongoose";
// import dailyStatus from "../../models/Production/dailyStatus.js";

// // MongoDB connection URI
// const uri = "mongodb://localhost:27017/yourDatabaseName"; // Replace with your database name

// // Initialize Express app
// const app = express();

// // Middleware to handle JSON responses
// app.use(express.json());

// // Connect to MongoDB once during server initialization
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.error("Error connecting to MongoDB:", error));

// // Route to fetch data and send it to the frontend
// app.get("/api/dailyStatus", async (req, res) => {
//   try {
//     // Fetch all documents in the dailyStatus collection, excluding geoFenceStoppage
//     const data = await dailyStatus.find({}, { geoFenceStoppage: 0 });

//     // Send the data as JSON to the frontend
//     res.status(200).json({
//       success: true,
//       message: "Data fetched successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching data",
//       error: error.message,
//     });
//   }
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
