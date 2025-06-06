import GeoFenceMap from "../../models/Production/geoFence.js";
import globalVariable from "../../models/Production/globalVariable.js";
import tripStatus from "../../models/Production/trip.js";

import {isInsideGeofence,
  initiatingUnscheduledStoppage,
  initiatingGeofenceStoppage,
  initiatingIdilingStoppage,
  endingUnscheduledStoppage,
  endingIdilingStoppage,
  endingGeofenceStoppage,
  dataInsertionGlobalVariable,
  equal,} from "../../lib/stoppages.js"





async function dataInsertionUnscheduledStoppage(element) {
  const motionStatus=(element?.status.toLowerCase().includes("idling")) ? "idling" : "notIdling";
  const parsedData={
    "number": element.vehicleNumber,
    "motionStatus": motionStatus,
    "movementLat" : element.latitude,
    "movementLong" : element.longitude,
    "statusMessageReceivedAt" : new String(element.lastPacketReceivedAt)
  }
  try {
      // Fetch the existing document containing location data
      let existingDoc = await globalVariable.findOne({});
      existingDoc = existingDoc?.hashMap;

      if (existingDoc?.has(parsedData.number)) {
        const value = existingDoc.get(parsedData.number);

        //Below conditional statements is to manage idiling stoppage
        //checking if motion status is idiling or if idiling stoppage has been initiated earlier
        if(parsedData.motionStatus=== 'idling' || value[4]){

          // condition 1: case to check if vechile was previously in idiling and current values also indicate it is in idiling
          if (parsedData.motionStatus=== 'idling' && value[4]) {

            console.log("Idiling Stoppage persists")
            // await dataInsertionGlobalVariable(parsedData.number, value[0], value[1], value[2], value[3],1,value[5])

          } 

          //condition 2: this case will initiate new idiling status
          else if (parsedData.motionStatus=== 'idling' && !value[4]) {
            console.log('Initiating Idiling Stoppage');

            await initiatingIdilingStoppage(parsedData, {driverName: parsedData?.driverName || "NAN",});

            // to set the idiling status in hash map as true
            await dataInsertionGlobalVariable(parsedData.number, value[0], value[1], value[2], value[3],1,value[5])
          } 

          // Condition 3: this will end idiling stoppage
          else if (!(parsedData.motionStatus === 'idling') && value[4]) {
            console.log('Ending Idiling Stoppage');

            await endingIdilingStoppage(parsedData);

            // to set the idiling status in hash map as false
            await dataInsertionGlobalVariable(parsedData.number, value[0], value[1], value[2], value[3],0,value[5])
          } 
          else{
            console.log(parsedData.motionStatus,value[4])
            console.log("unexpected case has occured")
          }
        }

        //fetch the trip status from the trip table to check if vechile is currently inside geoFence or outside
        let existingTrip = await tripStatus.findOne({ vehicleNo: parsedData.number });
        let insideGeoFence=false 

        // logic to check if the vechile is inside geo fence
        if(existingTrip){

          //fetching current trip geofence details
          let startingGeofence=await GeoFenceMap.findById(existingTrip?.startingGeofence);
          let endingGeofence=await GeoFenceMap.findById(existingTrip?.endingGeofence);
          let checkPoints=existingTrip.checkPoints;

          let insideCheckPoint= false
          if(checkPoints){
            checkPoints.forEach(async function(element){
              let coordinates=await GeoFenceMap.findById(element);
              insideCheckPoint = insideCheckPoint || 
                              isInsideGeofence(parsedData.movementLat,
                                              parsedData.movementLong,
                                              coordinates.latitude,
                                              coordinates.longitude,
                                              coordinates.radius)
            });
          }

          startGeoLat= startingGeofence.latitude
          startGeoLong=startingGeofence.longitude
          startGeoRadius=startingGeofence.radius

          endGeoLat= endingGeofence.latitude
          endGeoLong=endingGeofence.longitude
          endingGeoRadius=startingGeofence.radius

          // checking if inside any of the geoFence
          insideGeoFence=isInsideGeofence(parsedData.movementLat,parsedData.movementLong,startGeoLat,startGeoLong,startGeoRadius) ||
                         isInsideGeofence(parsedData.movementLat,parsedData.movementLong,endGeoLat,endGeoLong,endGeoRadius) ||
                         insideCheckPoint
        }

        // Below conditional statements is to manage geofence stoppage
        // checking if vechile is currently inside geofence or not
        if(insideGeoFence){ 

          //condition 1: will check if vechile is moving or stopped
          if (!equal(value[0], value[1], value[2], value[3]) &&!equal(value[2], value[3], parsedData.movementLat, parsedData.movementLong) &&parsedData.movementLat && parsedData.movementLong) {

            //function call to update the current location in hash map
            const lat1 = value[2];
            const long1 = value[3];
            const lat2 = parsedData.movementLat;
            const long2 = parsedData.movementLong;

            await dataInsertionGlobalVariable(parsedData.number, lat1, long1, lat2, long2,value[4],false)
          } 

          // Condition 2: previous locations mismatch but current one is matching therefore initiating geoFence soppage
          else if (!equal(value[0], value[1], value[2], value[3]) && equal(value[2], value[3], parsedData.movementLat, parsedData.movementLong)) {
            
            console.log('Initiating geofence stoppage');
            await initiatingGeofenceStoppage(parsedData, {driverName: parsedData?.driverName || "NAN",});

            // function call to set geoFencestoppage status as true
            const lat1 = value[2];
            const long1 = value[3];

            await dataInsertionGlobalVariable(parsedData.number, lat1, long1, lat1, long1,value[4],true)

          } 

          // Condition 3: previous location matches but current mismatches therefore ending geofence stoppage
          else if (equal(value[0], value[1], value[2], value[3]) && !equal(value[2], value[3], parsedData.movementLat, parsedData.movementLong)) {
            
            console.log('Ending GeoFence Stoppage');
            await endingGeofenceStoppage(parsedData);

            // function call to set geoFencestoppage status as false
            const lat1 = value[0];
            const long1 = value[1];
            const lat2 = parsedData.movementLat;
            const long2 = parsedData.movementLong;

            await dataInsertionGlobalVariable(parsedData.number, lat1, long1, lat2, long2,value[4],false)

          } 
          
          // condition 4: if previous locations as well as current location mismatches
          else if(equal(value[0], value[1], value[2], value[3]) && equal(value[2], value[3],parsedData.movementLat, parsedData.movementLong)) {
            
            console.log("geofence Stoppage persists");
          }

          else{

            console.log("unexpected case has occured")
          
          }
        }

        //Below conditional statements is to manage unscheduled stoppage
        else{

          // this conditional statement is to handle special case when stoppage is initiated inide geofence
          // but next ping for location is recived outside the geofence
          if(value[5]){

            //function call to end geofence stoppage and update its status to false in hashMap
            await endingGeofenceStoppage(parsedData);
            await dataInsertionGlobalVariable(parsedData.number, value[0], value[1], value[2], value[3],value[4],false)

          }


          //condition 1: will check if vechile is moving or stopped
          if (!equal(value[0], value[1], value[2], value[3]) && !equal(value[2], value[3], parsedData.movementLat, parsedData.movementLong) && parsedData.movementLat && parsedData.movementLong){
            
            // updating new location in hash map
            const lat1 = value[2];
            const long1 = value[3];
            const lat2 = parsedData.movementLat;
            const long2 = parsedData.movementLong;

            await dataInsertionGlobalVariable(parsedData.number, lat1, long1, lat2, long2,value[4],value[5])
          } 

          // Condition 2: previous locations mismatch but current one is matching therefore initiating geoFence stoppage
          else if (!equal(value[0], value[1], value[2], value[3]) && equal(value[2], value[3], parsedData.movementLat, parsedData.movementLong)) {
            
            console.log('Initiating geofence stoppage');
            await initiatingUnscheduledStoppage(parsedData, {driverName: parsedData?.driverName || "NAN",});

            //updating current location values in hashMap
            const lat1 = value[2];
            const long1 = value[3];

            await dataInsertionGlobalVariable(parsedData.number, lat1, long1, lat1, long1,value[4], value[5])

          } 

          // Condition 3: previous location matches but current mismatches therefore ending geofence stoppage
          else if (equal(value[0], value[1], value[2], value[3]) && !equal(value[2], value[3], parsedData.movementLat, parsedData.movementLong)) {
            
            console.log('Ending unscheduled stopppage');
            await endingUnscheduledStoppage(parsedData);

            //updating current location values in hashMap
            const lat1 = value[0];
            const long1 = value[1];
            const lat2 = parsedData.movementLat;
            const long2=parsedData.movementLong;

            await dataInsertionGlobalVariable(parsedData.number, lat1, long1, lat2, long2,value[4],value[5])
          } 
          
          // condition 4: if previous locations as well as current location mismatches
          else if(equal(value[0], value[1], value[2], value[3]) && equal(value[2], value[3],parsedData.movementLat, parsedData.movementLong)) {
            
            console.log("unscheduled Stoppage persists");
         
          }

          else{
            
            console.log("unexpected case has occured")
          
          }
        }
      } else {
        
        console.log('Adding new entry to hash map as vechile does not exist in hashMap');

        // Insert data into global variable
        let lat2=parsedData.movementLat;
        let long2=parsedData.movementLong;
        if(lat2===null || lat2===undefined){
          lat2=560
          long2=560
        }
        await dataInsertionGlobalVariable(parsedData.number,360,360,lat2,long2,0,false);

      }
  } catch (error) {
    
    console.error("Error fetching data:", error);
  
  }
}


export { dataInsertionUnscheduledStoppage };
