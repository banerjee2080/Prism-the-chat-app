import express from "express";
import {
  addContact,
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  getContacts,
  deleteContact,
  addDevice,
  getDevices,
  removeDevice,
} from "../controllers/auth.controllers.js";
import { ProtectedRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.put("/updateProfile", ProtectedRoute, updateProfile);
authRouter.get("/check", ProtectedRoute, checkAuth);
authRouter.post("/addContact", ProtectedRoute, addContact);
authRouter.get("/getContacts", ProtectedRoute, getContacts);
authRouter.delete("/delete/:id", ProtectedRoute, deleteContact);
authRouter.post("/device", ProtectedRoute, addDevice);
authRouter.get("/device", ProtectedRoute, getDevices);
authRouter.delete("/device/:deviceId", ProtectedRoute, removeDevice);

export default authRouter;
