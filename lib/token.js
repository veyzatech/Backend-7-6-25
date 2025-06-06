import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateTokenAndSetCookie = async (userId, res) => {
  const token = jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: "30d",
  }); // Token valid for 7 days
  await res.cookie("Veyza", token, {
    httpOnly: true,
    // secure: true, not for local development
    // sameSite: "Strict", // Protect against CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

export { generateTokenAndSetCookie };
