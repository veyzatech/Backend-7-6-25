import jwt from "jsonwebtoken";

export function createJWTToken(payload) {
  // Adjust options such as token expiry as needed.
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}
