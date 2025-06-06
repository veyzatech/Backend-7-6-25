import jwt from "jsonwebtoken";
import User from "../models/Core/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // Extract the Authorization header (expected format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Extract token string by removing "Bearer " prefix and trim extra whitespace.
    let token = authHeader.substring(7).trim();
    token = token.replace(/^"+|"+$/g, "");

    // Ensure the secret is defined.
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      console.error("JWT_SECRET_KEY is missing from environment variables.");
      return res
        .status(500)
        .json({ message: "Internal server error: secret key missing." });
    }
    console.log("Using secret:", secret);

    // Verify the token using the secret.
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token. Authentication failed." });
    }
    console.log("Decoded token:", decoded);

    // Find the user using the ID provided in the token payload (ensure key name matches)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user document to request, and set an additional `userId` property.
    req.user = { ...user.toObject(), userId: user._id };
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res
      .status(401)
      .json({ message: "Authentication failed.", error: error.message });
  }
};
