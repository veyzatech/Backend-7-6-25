import { updatedOrCreateMasterAPI } from "../loconav/dbControllers.js";

// Assume `Vehicle` is your Mongoose model
//item  is parsed data
export const addToDatabaseForMasterApi = async (item) => {
  await updatedOrCreateMasterAPI(item, {
    deviceSerialNumber: item.deviceSerialNumber || "NAN",
    devicePhoneNumber: item.devicePhoneNumber || "NAN",
    deviceType: item.deviceType || "NAN",
    createdAT: item.createdAT,
    subscriptionExpiresAt: item.subscriptionExpiresAt, // handle
  });
};
