import mongoose, { Schema } from "mongoose";

const dailyStatusSchema = new Schema({
  vehicleNumber:{
    type: String,
    required: true,
    unique :true
  },  
  driverName: {
    type: String,
    required: false,
    trim: true,
  },
  unscheduledStops : [   
    //need review
    //this will be used to store history of unscheduled stoppage
    //also this will be used to calculate value of above two attributes
    {
      // bucketType : String,    //["<20 Min","20-60 Min",">1 Hrs"]
      startingTime: Date,
      endingTime: Date,
      totalTime: Number,
    }
  ],
  unsheduledStoppageCount:{   
    //this will store count of unscheduled stoppage
    type: Number,
    // enum: ["<20 Min","20-60 Min",">1 Hrs"]  Define allowed bucket types
    default :0,
    required: false,
  },
  timeDurationUnscheduledStoppage : {  
    // this will store total time in min
    type : Number,
    default : 0,
    required : false,
  },
  geoFenceStoppageCount :{
    type: Number,
    // enum: ["<20 Min","20-60 Min",">1 Hrs"], // Define allowed bucket types
    required: false,
  },
  timeDurationGeoFence : {
    type : Number, // will store time duration in minutes
    required : false,
  },
  geoFenceStops : [   //need review
    //this will store history of geofence stops
    {
      startingTime: Date,
      endingTime: Date,
      totalTime: Number,
    }
  ],
  idlingCount :{
    type: Number,
    // enum: ["<5 Min","5-15 Min",">15 Hrs"], // Define allowed bucket types
    required: false,
  },
  timeDurationIdling : {
    // this will store time duration of idiling in minutes
    type : Number,  
    required : false,
  },
  idlingStops : [   //need review
    {
      startingTime: Date,
      endingTime: Date,
      totalTime: Number,
    }
  ],
  dailyRunningKM :{  
    //to calculate this  use odo meter reading of past 24 hr
    type: Number,  //IN KM
    // enum: ["<100 Km","100-200 Km",">200 Km"], // Define allowed bucket types
    required: false,
  },
  dailyRunning : [   
    //need review
    {
      kilometers: Number, //this will store daily km of  particular day
    }
  ],
});

const dailyStatus = mongoose.model("dailyStatus", dailyStatusSchema);

export default dailyStatus;
