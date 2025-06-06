import mongoose, { Schema } from "mongoose";

const variableSchema = new Schema({
  _id: {
    type: String,
    default: "uniqueDocumentId", // Ensures there's only one document
  },
  hashMap: {
    type: Map, // This specifies the top-level map
    of: [Number],   //[lat1,long1.lat2,long2,idiling,geoFenceStoppageStatus]
  },
});

const globalVariable = mongoose.model("globalVariable", variableSchema);

export default globalVariable;



// lat1-> this will store the previous to previous latitude
// long1-> this will store the previous to previous longitude
// lat2-> this will store previous latitude
// long2-> this will store previous longitude
// idiling-> this will store if currently any idiling stoppage has been initiated or not?
// geoFenceStoppageStatus-. this will store if currently any geoFence stoppage has been inintiated?