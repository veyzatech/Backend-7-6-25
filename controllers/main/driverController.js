import Driver from "../../models/Core/Driver.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DriverOTP from "../../models/Core/DriverOTP.js";
import DriverSession from "../../models/Core/DriverSession.js";
// Assume you have a function to create JWT tokens:
import { createJWTToken } from "../../lib/jwt.js";

// Helper function to get the token from the Authorization header
function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
}

/**
 * Send OTP: Looks up the driver by mobile (using the driver’s contact field),
 * calls an external OTP API, and stores the verification details.
 */
async function sendOTP(req, res) {
  try {
    const { mobile } = req.body;
    // Find driver by mobile (assuming 'contact' stores the mobile number)
    const driver = await Driver.findOne({ contact: mobile });
    if (!driver) {
      return res.status(400).json({ message: "Driver does not exist" });
    }
    
    // Call external API to send OTP
    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-75EF7E3CBDDC43E&flowType=SMS&mobileNumber=${mobile}`;
    // Use the same authToken as in the Python code (or load it from config)
    const headers = {
      'authToken': "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTc1RUY3RTNDQkREQzQzRSIsImlhdCI6MTczOTQxOTcyOCwiZXhwIjoxODk3MDk5NzI4fQ.uhsGG4YvLOE8_4j2uh9nMHXin4SpgXjPfv7iQBdcsr_831hp46WFLBJjhBQCZyrTO0J7maeTP5X-1CMXLhhSAA"
    };

    const response = await axios.post(url, {}, { headers });
    if (response.status !== 200 || response.data.message !== "SUCCESS") {
      return res.status(400).json({ message: "Failed to send OTP" });
    }
    const verificationId = response.data.data.verificationId;
    
    // Save or update the OTP record in the database.
    // (For simplicity, we are storing a placeholder OTP "no_otp" just as in the Python code.)
    const otpRecord = await DriverOTP.findOneAndUpdate(
      { driver_id: driver._id },
      {
        mobile,
        otp: "no_otp", // In a real implementation, you might generate a random OTP and send it via SMS.
        driver_id: driver._id,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 10 * 60000), // Expires in 10 minutes.
        retry_count: 0,
        verification_id: verificationId,
      },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Verify OTP: Validates the provided OTP by calling the external verification API.
 * If verified, marks any active sessions as inactive and creates a new session with a JWT token.
 */
async function verifyOTP(req, res) {
  try {
    const { mobile, otp } = req.body;
    // Look up the driver using the mobile number.
    const driver = await Driver.findOne({ contact: mobile });
    if (!driver) {
      return res.status(400).json({ message: "Driver does not exist" });
    }
    
    // Get the latest OTP record for this mobile.
    const otpRecord = await DriverOTP.findOne({ mobile }).sort({ created_at: -1 });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }
    
    const verificationId = otpRecord.verification_id;
    // Call external API to verify the OTP.
    const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${verificationId}&code=${otp}`;
    const headers = {
      'authToken': "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTc1RUY3RTNDQkREQzQzRSIsImlhdCI6MTczOTQxOTcyOCwiZXhwIjoxODk3MDk5NzI4fQ.uhsGG4YvLOE8_4j2uh9nMHXin4SpgXjPfv7iQBdcsr_831hp46WFLBJjhBQCZyrTO0J7maeTP5X-1CMXLhhSAA"
    };
    const response = await axios.get(url, { headers });
    if (
      response.status !== 200 ||
      response.data.message !== "SUCCESS" ||
      response.data.data.verificationStatus !== "VERIFICATION_COMPLETED"
    ) {
      return res.status(400).json({ message: "Failed to verify OTP" });
    }
    
    // Deactivate any active sessions for this driver.
    await DriverSession.updateMany(
      { driver_id: driver._id, is_active: true },
      { $set: { is_active: false, logged_out_at: Math.floor(Date.now() / 1000) } }
    );
    
    // Create a new session.
    const session_id = uuidv4();
    const auth_token = createJWTToken({ driver_id: driver._id, session_id, mobile });
    
    const newSession = new DriverSession({
      session_id,
      mobile,
      driver_id: driver._id,
      is_active: true,
      logged_in_at: Math.floor(Date.now() / 1000),
      auth_token,
    });
    await newSession.save();
    
    return res.status(200).json({ auth_token, driver_details: driver });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * Logout: Extracts the driver ID from the JWT token (sent in the Authorization header)
 * and marks all active sessions for that driver as inactive.
 */
async function logoutDriver(req, res) {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const driver_id = decoded.driver_id;
    if (!driver_id) {
      return res.status(401).json({ message: "Driver ID missing" });
    }
    
    await DriverSession.updateMany(
      { driver_id, is_active: true },
      { $set: { is_active: false, logged_out_at: Math.floor(Date.now() / 1000) } }
    );
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logoutDriver:", error);
    return res.status(500).json({ message: error.message });
  }
}

export {
  sendOTP,
  verifyOTP,
  logoutDriver,
};
