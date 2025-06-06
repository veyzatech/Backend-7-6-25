// import VehicleDailyReport from "../models/VehicleDailyReport.js";
// import ActiveDriver from "../models/ActiveDriver.js";
// import ConcorLocationsDetailed from "../models/ConcorLocationsDetailed.js";
// import Geofence from "../models/GeoFence.js";
// import HubStoppageReport from "../models/HubStoppageReport.js";
// import HubToHubReport from "../models/HubToHubReport.js";
// import Overspeeding from "../models/Overspeeding.js";
// import StoppageReport from "../models/Stoppage.js";
// import VehicleDocuments from "../models/VehicleDocuments.js";
// import VehicleOdoReport from "../models/VehicleOdoReport.js";
// import Idling from "../models/Idling.js";
import { updateOrCreateVehicleLocation } from "./loconav/dbControllers.js";

//Function to add all things related to vehicle from the api to database after Parsing
export const addToDatabase = async (item) => {
  // VehicleDailyReport.create({
  //   vehicleNumber: item.number,
  //   date: new Date(),
  //   distanceTravelled: 0,
  //   fuelConsumed: 0,
  //   fuelConsumedUnit: "liters", //default
  //   mileage: 0,
  //   mileageUnit: "km/l", //default
  //   totalIdlingTime: 0,
  //   fuelConsumedWhileIdling: 0,
  //   totalEngineTime: "00:00",
  //   dailyRunningKm: 0,
  // });

  // ActiveDriver.create({
  //   status: "Inactive", //default
  //   driverName: "NaN",
  //   phoneNumber: "0000000000",
  //   vehicleNumber: item.number,
  //   deployedOn: new Date(),
  //   driverNameInDL: "NaN",
  //   dlNo: "NaN",
  //   aadharNo: "000000000000",
  //   dob: new Date(),
  //   fatherName: "NaN",
  //   ifsc: "NaN",
  //   accountNumber: "NaN",
  //   bankName: "NaN",
  //   holderName: "NaN",
  //   driverAddress: "NaN",
  //   dlValidity: new Date(),
  //   bucket: 90,
  //   today: new Date(),
  //   days: 0,
  //   dlStatus: "Valid", //default
  // });

  // ConcorLocationsDetailed.create({
  //   vehicleNumber: item.number,
  //   origin: "NaN",
  //   destination: "NaN",
  //   odometer: Number(item.currentOdometerReading),
  //   vehicleStatus: "Active", //default
  //   driverName: "NaN",
  //   driverNo: "NaN",
  //   fuelStatus: "Empty",
  //   remarks: "NaN",
  //   customer: "NaN",
  //   location: [item.lastLocation],
  //   lastUpdatedAt: item.lastLocatedAt,
  // });

  //Function to update or create Vehicles as per their location and the model ConcorLocationsDetailed
  await updateOrCreateVehicleLocation(item.number, item.lastLocation, {
    origin: "NaN",
    destination: "NaN",
    odometer: Number(item.currentOdometerReading),
    vehicleStatus: "Active", //default
    driverName: "NaN",
    driverNo: "NaN",
    fuelStatus: "Empty",
    remarks: "NaN",
    customer: "NaN",
    lastUpdatedAt: item.lastLocatedAt,
  });

  // Geofence.create({
  //   vehicle: item.number,
  //   dateTime: new Date(),
  //   action: "exit", //default
  //   geofence: "NaN",
  //   date: new Date(),
  //   time: "00:00",
  //   timeDuration: 0,
  // });

  // HubStoppageReport.create({
  //   vehicleNumber: item.number,
  //   hub: "NaN",
  //   startingDateTime: new Date(),
  //   endDateTime: new Date(),
  //   totalEnRouteStoppageHours: 0,
  //   location: "NaN",
  // });

  // HubToHubReport.create({
  //   vehiclePlate: item.number,
  //   fromHub: "NAN",
  //   startingDateTime: new Date(),
  //   toHub: "NAN",
  //   arrivalDateTime: new Date(),
  //   totalTripTime: 0,
  //   totalMovingTime: 0,
  //   startDate: new Date(),
  //   startTime: "00:00",
  //   endDate: new Date(),
  //   endTime: "00:00",
  //   gpsDistanceKm: 0,
  //   averageSpeedKmH: 0,
  //   fuelConsumptionKg: 0,
  //   mileageKmKg: 0,
  //   startOdometerKm: 0,
  //   startOdoTime: "00:00",
  //   endOdometerKm: 0,
  //   endOdoTime: "00:00",
  //   startEngineHour: 0,
  //   endEngineHour: 0,
  //   totalEngineHour: 0,
  //   harshAcceleration: 0,
  //   totalKm: 0,
  //   totalLng: 0,
  //   totalTrip: 0,
  //   driverName: "NaN",
  //   idlingTimeMin: 0,
  //   totalStopTime: 0,
  //   geofence: false, //default
  //   durationSec: 0,
  // });

  // Idling.create({
  //   vehicle: item.number,
  //   dateTime: new Date(),
  //   idlingTimeMin: 0,
  //   fuelConsumedKg: 0,
  //   address: "NaN",
  //   time: "00:00",
  //   lat: item.movementLat,
  //   lng: item.movementLong,
  //   cost: 0,
  //   timeDuration: 0,
  // });

  // Overspeeding.create({
  //   vehicle: item.number,
  //   dateTime: new Date(),
  //   maxSpeed: 0,
  //   location: item.lastLocation, //default
  //   distanceCovered: 0,
  //   date: new Date(),
  //   time: "00:00",
  //   durationSec: 0,
  //   lat: item.movementLat,
  //   lng: item.movementLong,
  //   completionDateTime: new Date(),
  //   minBucketing: 0,
  //   vehicleOverSpeedCount: 0,
  //   hardBreaking: false, //default
  //   cost: 0,
  //   harshAcceleration: false, //default
  //   idlingTimeMin: 0,
  //   fuelConsumedKg: 0,
  //   KgLNG: 0,
  //   driverName: "NaN",
  //   mobile: "9999999999",
  //   hardBreakingRating: "Good", //default
  //   training: false, //default
  // });

  // await updateOrCreateOverSpeedingRecord(item.number,item.location,item.lat,item.lng,item.speed,{
  //   dateTime: new Date(),
  //   distanceCovered: 0,
  //   date: new Date(),
  //   time: "00:00",
  //   durationSec: 0,
  //   completionDateTime: new Date(),
  //   minBucketing: 0,
  //   vehicleOverSpeedCount: 0,
  //   hardBreaking: false, //default
  //   cost: 0,
  //   harshAcceleration: false, //default
  //   idlingTimeMin: 0,
  //   fuelConsumedKg: 0,
  //   KgLNG: 0,
  //   driverName: "NaN",
  //   mobile: "9999999999",
  //   hardBreakingRating: "Good", //default
  //   training: false, //default
  // });

  // StoppageReport.create({
  //   vehicleNumber: item.number,
  //   hub: "NaN",
  //   startingDateTime: new Date(),
  //   endDateTime: new Date(),
  //   totalEnRouteStoppageHours: 0,
  //   location: "NaN",
  //   timeDuration: "00:00:00",
  //   unscheduledStoppage: false, //default
  //   geofenceStoppage: false, //default
  //   GG: "NaN",
  //   idling: 0,
  //   II: "NaN",
  //   dailyRunningKm: 0,
  //   KK: "NaN",
  //   driverName: "NaN",
  // });

  // await updateOrCreateStoppageReport(item,{
  //   vehicleNumber: item.number,
  //   hub: "NaN",
  //   totalEnRouteStoppageHours: 0,
  //   GG: "NaN",
  //   idling: 0,
  //   II: "NaN",
  //   dailyRunningKm: 0,
  //   KK: "NaN",
  //   driverName: "NaN",
  // });

  // VehicleDocuments.create({
  //   truckRegnNo: item.number,
  //   validityOfFitnessCertificate: new Date(),
  //   validityOfInsuranceCertificate: new Date(),
  //   validityOfNationalPermit: new Date(),
  //   validityOfBasicGoodsPermit: new Date(),
  //   validityOfTaxCertificate: new Date(),
  //   validityOfPUC: new Date(),
  //   today: new Date(),
  //   day1: new Date(),
  //   day2: new Date(),
  //   day3: new Date(),
  //   day4: new Date(),
  //   day5: new Date(),
  //   day6: new Date(),
  //   fitnessBucket: 15,
  //   insuranceBucket: 15,
  //   permitBucket: 15,
  //   statePermitBucket: 15,
  //   taxCertificateBucket: 15,
  //   pucBucket: 15,
  //   trailerRegistrationNo: "NaN",
  //   trailerFitnessCertificateValidity: new Date(),
  //   trailerInsuranceCertificateValidity: new Date(),
  //   trailerNationalPermitValidity: new Date(),
  //   trailerBasicGoodsPermitValidity: new Date(),
  //   trailerTaxCertificateValidity: new Date(),
  //   trailerPUCValidity: new Date(),
  //   trailerFitnessBucket: 15,
  //   trailerInsuranceBucket: 15,
  //   trailerPermitBucket: 15,
  //   trailerStatePermitBucket: 15,
  //   trailerTaxCertificateBucket: 15,
  //   trailerPucBucket: 15,
  //   remark: "NaN",
  // });

  // VehicleOdoReport.create({
  //   vehiclePlate: item.number,
  //   startDate: new Date(), // Alternatively, you can set a valid placeholder date like new Date("1970-01-01")
  //   startTime: "00:00",
  //   startOdoKm: 0,
  //   endDate: new Date(), // Alternatively, you can set a valid placeholder date like new Date("1970-01-01")
  //   endTime: "00:00",
  //   endOdoKm: 0,
  //   totalDistanceKm: 0,
  //   startEngineHours: 0,
  //   endEngineHours: 0,
  //   totalEngineHours: 0,
  // });
};
