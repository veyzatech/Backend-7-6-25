import express from "express";
import {
  addUser,
  createAccount,
  deleteAccount,
  deleteUser,
  getAccountById,
  loginUser,
  logoutUser,
  updateAccount,
  updateUser,
} from "../controllers/main/accounts.js";
import {
  authenticateUser,
} from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/account/create-account", createAccount);
router.get("/account/account-details/:accountId", getAccountById);
router.put("/account/update-account/:accountId", updateAccount);
router.delete(
  "/account/delete-account/:accountId",
  authenticateUser,
  deleteAccount
);
router.post("/account/create-user", authenticateUser, addUser);
router.put("/account/users/:userId", authenticateUser, updateUser);
router.delete("/account/users/:userId", authenticateUser, deleteUser);
router.post("/account/login", loginUser);
router.post("/account/logout", authenticateUser, logoutUser);

export default router;
