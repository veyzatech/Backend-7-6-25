import mongoose, { Schema } from "mongoose";

const GeoFenceMapSchema = new Schema({
  geoFenceName: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
});

const GeoFenceMap = mongoose.model("GeoFenceMap", GeoFenceMapSchema);

export default GeoFenceMap;
