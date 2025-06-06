import express from "express";
import {
  login,
  logout,
  signup,
} from "../controllers/deploymentFunctionCall/userLogin.js";
import verifyAuth from "../middlewares/userAuth.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyAuth, logout);
export default router;
