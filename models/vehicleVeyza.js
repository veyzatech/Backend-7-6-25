import mongoose, { Schema } from "mongoose";

const vehicleVeyzaSchema = new Schema({
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
    unique : true
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  GPS:{
    type: Boolean,
    required: true,
    default:false
  },
  onBoard:{
    type: Boolean,
    required: true,
    default: false,
  },
  subscriptionStartVeyza:{
    type: Date,
    required: true,
  },
  subscriptionEndVeyza: {
    type: Date,
    required: false,
  }

});

const vehicleVeyza = mongoose.model(
  "vehicleVeyza",
  vehicleVeyzaSchema
);

export default vehicleVeyza;
