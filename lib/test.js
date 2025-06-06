// import { model } from "mongoose";
// import VehicleDailyReport from "../models/VehicleDailyReport";
// import ActiveDriver from "../models/ActiveDriver";
// import ConcorLocationsDetailed from "../models/ConcorLocationsDetailed";
// import Geofence from "../models/GeoFence";
// import HubStoppageReport from "../models/HubStoppageReport";
// import HubToHubReport from "../models/HubToHubReport";
// import Overspeeding from "../models/Overspeeding";
// import StoppageReport from "../models/Stoppage";
// import VehicleDocuments from "../models/VehicleDocuments";
// import VehicleOdoReport from "../models/VehicleOdoReport";

// const abc = (item) => {
//   VehicleDailyReport.create({
//     id: item.id || 833294,
//     vehicleNumber: item.vehicleNumber || "NaN",
//     date: item.date || "NaN",
//     distanceTravelled: item.distanceTravelled || 0,
//     fuelConsumed: item.fuelConsumed || 0,
//     fuelConsumedUnit: item.fuelConsumedUnit || "liters",
//     milegae: item.mileage || 0,
//     mileageUnit: item.mileageUnit || "km/l",
//     totalIdlingTime: item.totalIdlingTime || 0,
//     fuelConsumedWhileIdling: item.fuelConsumedWhileIdling || 0,
//     totalEngineTime: item.totalEngineTime || "NaN",
//     dailyRunningKm: item.dailyRunningKm || 0,
//   });

//   ActiveDriver.create({
//     status: item.status || "Inactive",
//     driverName: item.driverName || "NaN",
//     phoneNumber: item.phoneNumber || "0000000000",
//     vehicleNumber: item.vehicleNumber || "NaN",
//     deployedOn: item.deployedOn || "00-00-00",
//     driverNameInDL: item.driverNameInDL || "NaN",
//     dlNo: item.dlNo || "NaN",
//     aadharNo: item.aadharNo || "NaN000000000",
//     dob: item.dob || new Date("NaN"),
//     fatherName: item.fatherName || "NaN",
//     ifsc: item.ifsc || "NaN",
//     accountNumber: item.accountNumber || "NaN",
//     bankName: item.bankName || "NaN",
//     driverAddress: item.driverAddress || "NaN",
//     dlValidity: item.dlValidity || new Date("NaN"),
//     bucket: item.bucket || "A",
//     today: item.today || new Date("NaN"),
//     days: item.days || 0,
//     dlStatus: item.dlStatus || "Valid",
//   });

//   ConcorLocationsDetailed.create({
//     vechileNumber: item.vehicleNumber || "NaN",
//     origin: item.origin || "NaN",
//     destination: item.destination || "NaN",
//     odometer: item.currentOdometerReading || 0,
//     vehicleStatus: item.vehicleStatus || "Active",
//     driverName: item.driverName || "NaN",
//     driverNo: item.driverNo || "NaN",
//     fuelStatus: item.fuelStatus || "Empty",
//     remarks: item.remarks || "NaN",
//     customer: item.customer || "NaN",
//     location: item.lastLocation || "NaN",
//     lastUpdatedAt: item.lastLocatedAt || new Date("NaN"),
//   });

//   Geofence.create({
//     vehicle: item.vehicle || "NaN",
//     dateTime: item.dateTime || new Date("NaN"),
//     action: item.action || "exit",
//     geofence: item.geofence || "NaN",
//     date: item.date || new Date("NaN"),
//     time: item.time || "00:00",
//     timeDuration: item.timeDuration || 0,
//   });

//   HubStoppageReport.create({
//     vehicleNumber: item.vehicleNumber || "NaN",
//     hub: item.hub || "NaN",
//     startingDateTime: item.startingDateTime || new Date("NaN"),
//     endDateTime: item.endDateTime || new Date("NaN"),
//     totalEnRouteStoppageHours: item.totalEnRouteStoppageHours || 0,
//     location: item.location || "NaN",
//   });

//   HubToHubReport.create({
//     vechilePlate: item.vehiclePlate || "NaN",
//     fromHub: item.fromHub || "NaN",
//     startingDateTime: item.startingDateTime || new Date("NaN"),
//     toHub: item.toHub || "NaN",
//     arrivalDateTime: item.arrivalDateTime || new Date("NaN"),
//     totalTripTime: item.totalTripTime || 0,
//     totalMovingTime: item.totalMovingTime || 0,
//     gpsDistanceKm: item.gpsDistanceKm || 0,
//     averageSpeedKmH: item.averageSpeedKmH || 0,
//     fuelConsumptionKg: item.fuelConsumptionKg || 0,
//     mileageKmKg: item.mileageKmKg || 0,
//     startOdometerKm: item.startOdometerKm || 0,
//     startOdoTime: item.startOdoTime || "00:00",
//     endOdometerKm: item.endOdometerKm || 0,
//     endOdoTime: item.endOdoTime || "00:00",
//     totalKm: item.totalKm || 0,
//     geofence: item.geofence || false,
//     durationSec: item.durationSec || 0,
//   });

//   Overspeeding.create({
//     vechile: item.vehicle || "NaN",
//     dateTime: item.dateTime || new Date("NaN"),
//     maxSpeed: item.maxSpeed || 0,
//     location: item.location || "NaN",
//     distanceCovered: item.distanceCovered || 0,
//     time: item.time || "00:00",
//     durationSec: item.durationSec || 0,
//   });

//   StoppageReport.create({
//     vechileNumber: item.vehicleNumber || "NaN",
//     hub: item.hub || "NaN",
//     startingDateTime: item.startingDateTime || new Date("NaN"),
//     endDateTime: item.endDateTime || new Date("NaN"),
//     totalEnRouteStoppageHours: item.totalEnRouteStoppageHours || 0,
//     location: item.location || "NaN",
//     timeDuration: item.timeDuration || "00:00",
//   });

//   VehicleDocuments.create({
//     truckRegnNo: item.truckRegnNo || "NaN",
//     validityOfFitnessCertificate: item.validityOfFitnessCertificate || new Date("NaN"),
//     today: item.today || new Date("NaN"),
//   });

//   VehicleOdoReport.create({
//     vehiclePlate: item.vehiclePlate || "NaN",
//     startDate: item.startDate || new Date("NaN"),
//     startTime: item.startTime || "00:00",
//     startOdoKm: item.startOdoKm || 0,
//     endDate: item.endDate || new Date("NaN"),
//     endTime: item.endTime || "00:00",
//   });
// };

// export default abc;
