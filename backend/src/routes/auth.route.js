import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controllers.js";
import { ProtectedRoute } from "../middleware/auth.middleware.js"

const authRouter = express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.get("/logout",logout);
authRouter.put("/updateProfile",ProtectedRoute, updateProfile);
authRouter.get("/check",ProtectedRoute,checkAuth);


export default authRouter;