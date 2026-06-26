import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRouter from "./routes/message.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

//app.use(cors({}));

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter);

app.listen(PORT, () => {
    console.log("App listening on PORT: ",PORT);
    connectDB();
})

/*{
    "_id": "6a3e6d15a5f6dcb376f5355f",
    "fullName": "Amitabh Banerjee",
    "email": "amitabha1210333@gmail.com",
    "profilePic": ""
}
*/