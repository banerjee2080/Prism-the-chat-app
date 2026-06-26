import express from "express";
import { ProtectedRoute } from "../middleware/auth.middleware.js"
import { getAllMessages, getAllUsers, sendMessage } from "../controllers/message.controllers.js";

const messageRouter = express.Router();

messageRouter.get("/users",ProtectedRoute, getAllUsers); //get all the users for the sidebar
messageRouter.get("/:id", ProtectedRoute, getAllMessages ); //get all the messages between you and receiver with id req.params.id
messageRouter.post("/send/:id", ProtectedRoute, sendMessage); //send a message to user with an id req.params.id

export default messageRouter;