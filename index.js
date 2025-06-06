// Entry File for all the code for backend
//importing necessary modules/lib
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import os, { userInfo } from "os";
import cookieParser from "cookie-parser";
//importing lib functions
import connectDB from "./controllers/connectDB.js";

//importing routes
import allDataRoute from "./routes/allData.js";
// import driverRoute from "./routes/admin/driver.js";
import mapRoute from "./routes/mapRoute.js";
import geofences from "./routes/geofences.js";
import checkpoint from "./routes/checkpoint.js";
import liveLocation from "./routes/liveLocation.js";
import driver from "./routes/driver.js";
import routeRoutes from "./routes/routeRoutes.js";
// import trip from "./routes/trip.js";
import trip from "./routes/trip.js";
import accounts from "./routes/accounts.js";
import vehicles from "./routes/vehicles.js";
import vehicleGroup from "./routes/vehicleGroup.js";
import dailyStatus from "./routes/dailyStatus.js";
import vehicleDocument from "./routes/vehicleDocument.js";
import uploadRouter from "./routes/vehicleDocument.js";
import { loconavAPIHandler } from "./controllers/loconav/apiDataHandler.js";
import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//importing scheduler
import startLiveLocationScheduler from "./lib/scheduler.js";

// import protect from "./middlewares/userAuth.js";
//creating server
const app = express();


// middleware to parse json
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://www.veyza.in",
      "http://localhost:5173",
      "https://website-red-five-85.vercel.app",
      "https://veyza-dashboard-86kl9bsk1-00bakers-projects.vercel.app",
      "https://veyza-dashboard.vercel.app",
      "https://veyza-dashboard-ten.vercel.app/",
      "*",
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors()); // Handle preflight requests
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     'https://www.veyza.in'
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

//linking dotenv
dotenv.config();
app.use(cookieParser());

// variables/information from .env
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
//connect Database
connectDB(MONGO_URI);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use("/veyza-api/v0", allDataRoute);
// app.use("/veyza-api/v0", driverRoute);
// app.use("/veyza-api/v0", mapRoute);
app.use("/veyza-api/v0", geofences);
app.use("/veyza-api/v0", checkpoint);
app.use("/veyza-api/v0", trip);
app.use("/veyza-api/v0", accounts);
app.use("/veyza-api/v0", vehicles);
app.use("/veyza-api/v0", vehicleGroup);
app.use("/veyza-api/v0", liveLocation);
app.use("/veyza-api/v0", driver);
app.use("/veyza-api/v0", dailyStatus);
app.use("/veyza-api/v0", routeRoutes);
// app.use("/v0/upload", uploadRouter);
app.use("/veyza-api/v0/", vehicleDocument);

app.get("/", (req, res) => {
  res.send("This is the home route to test");
});

// Helper function to get the actual network address
const getNetworkAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};
app.listen(PORT, () => {
  console.log(`Server working on http://localhost:${PORT}`);
  const address = getNetworkAddress();
  console.log(`Server working on http://${address}:${PORT}`);
});

startLiveLocationScheduler(); // would be turned on for Deployment Level

// const loconav_auth_key = process.env.LOCONAV_AUTH_KEY;
// const runLoconavTask = async (auth_key) => {
//   try {
//     console.log("Running scheduled Loconav data fetch...");

//     await loconavAPIHandler(
//       { headers: { auth_key } },
//       {
//         status: () => ({ json: console.log }),
//       }
//     );
//   } catch (error) {
//     console.error("Error running scheduled Loconav task:", error);
//   }
// };

// Run every 5 minutes (300,000 ms)
// setInterval(() => {
//   runLoconavTask(loconav_auth_key);
// }, 300000);
