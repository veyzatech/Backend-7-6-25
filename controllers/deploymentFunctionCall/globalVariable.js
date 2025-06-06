import variable from "../../models/Production/globalVariable";


// Add a new entry to hashMap
const addEntry = async (vehicleNumber, position, latitude, longitude) => {
  try {
    let doc = await variable.findOne(); // Assuming there is only one document; adjust if needed.
    if (!doc) {
      doc = new variable({ hashMap: {} }); // Create a new document if none exists
    }

    if (!doc.hashMap.has(vehicleNumber)) {
      doc.hashMap.set(vehicleNumber, new Map());
    }

    const vehicleMap = doc.hashMap.get(vehicleNumber);
    vehicleMap.set(position, { latitude, longitude });
    doc.markModified("hashMap"); // Notify Mongoose about changes to the map
    await doc.save();
    console.log(`Added entry for vehicle ${vehicleNumber}, position ${position}.`);
  } catch (error) {
    console.error("Error adding entry:", error);
  }
};

// Update an existing entry in hashMap
const updateEntry = async (vehicleNumber, position, latitude, longitude) => {
  try {
    const doc = await variable.findOne();
    if (doc && doc.hashMap.has(vehicleNumber)) {
      const vehicleMap = doc.hashMap.get(vehicleNumber);

      if (vehicleMap.has(position)) {
        vehicleMap.set(position, { latitude, longitude });
        doc.markModified("hashMap");
        await doc.save();
        console.log(`Updated entry for vehicle ${vehicleNumber}, position ${position}.`);
      } else {
        console.log(`Position ${position} does not exist for vehicle ${vehicleNumber}.`);
      }
    } else {
      console.log(`Vehicle ${vehicleNumber} does not exist.`);
    }
  } catch (error) {
    console.error("Error updating entry:", error);
  }
};

// Delete an entry from hashMap
const deleteEntry = async (vehicleNumber, position) => {
  try {
    const doc = await variable.findOne();
    if (doc && doc.hashMap.has(vehicleNumber)) {
      const vehicleMap = doc.hashMap.get(vehicleNumber);

      if (vehicleMap.has(position)) {
        vehicleMap.delete(position);
        doc.markModified("hashMap");

        // If the vehicleMap is empty after deletion, remove the vehicleNumber key
        if (vehicleMap.size === 0) {
          doc.hashMap.delete(vehicleNumber);
        }

        await doc.save();
        console.log(`Deleted position ${position} for vehicle ${vehicleNumber}.`);
      } else {
        console.log(`Position ${position} does not exist for vehicle ${vehicleNumber}.`);
      }
    } else {
      console.log(`Vehicle ${vehicleNumber} does not exist.`);
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
};
