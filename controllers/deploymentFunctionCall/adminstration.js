// import Driver from "../../models/Production/driver.js";

// //Driver Data

// //Create
// async function addDriverData(req, res) {
//   try {
//     const {
//       driverName,
//       contact,
//       aadhar,
//       dlNumber,
//       dlIssueDate,
//       dlExpiryDate,
//       vehicleNumber,
//     } = req.body;

//     // Create a new Driver document
//     const newDriver = new Driver({
//       driverName,
//       contact,
//       aadhar,
//       dlNumber,
//       dlIssueDate,
//       dlExpiryDate,
//       vehicleNumber,
//     });

//     // Save the document to the database
//     const savedDriver = await newDriver.save();
//     res
//       .status(201)
//       .json({ message: "Driver data added successfully", driver: savedDriver });
//   } catch (error) {
//     console.error("Error adding driver data:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to add driver data. Please try again." });
//   }
// }
// //Read
// async function fetchAdminstrationDriverData(req, res) {
//   try {
//     const data = await Driver.find({});
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Failed to fetch driver data." });
//   }
// }

// //Update
// async function updateDriverData(req, res) {
//   try {
//     const { aadhar } = req.params;
//     const updates = req.body;
//     console.log("provided adhar: ", aadhar);
//     console.log("provided updates: ", updates);

//     // Validate that at least one field is provided for updating
//     if (!Object.keys(updates).length) {
//       return res.status(400).json({ error: "No fields provided to update." });
//     }

//     // Find and update the driver document by aadhar
//     const updatedDriver = await Driver.findOneAndUpdate(
//       { aadhar },
//       { $set: updates },
//       { new: true } // Return the updated document
//     );

//     if (!updatedDriver) {
//       return res
//         .status(404)
//         .json({ error: "Driver not found with the given Aadhar." });
//     }

//     res.status(200).json({
//       message: "Driver data updated successfully",
//       driver: updatedDriver,
//     });
//   } catch (error) {
//     console.error("Error updating driver data by Aadhar:", error);
//     res.status(500).json({ error: "Failed to update driver data." });
//   }
// }

// //DELETE

// async function deleteDriverData(req, res) {
//   try {
//     const { aadhar } = req.params;

//     // Check if the driver exists
//     const driver = await Driver.findOne({ aadhar });
//     if (!driver) {
//       return res
//         .status(404)
//         .json({ error: "Driver not found with the given Aadhar." });
//     }

//     // Delete the driver
//     await Driver.deleteOne({ aadhar });

//     res.status(200).json({
//       message: `Driver with Aadhar ${aadhar} deleted successfully.`,
//     });
//   } catch (error) {
//     console.error("Error deleting driver data:", error);
//     res.status(500).json({ error: "Failed to delete driver data." });
//   }
// }

// export {
//   addDriverData,
//   fetchAdminstrationDriverData,
//   updateDriverData,
//   deleteDriverData,
// };
