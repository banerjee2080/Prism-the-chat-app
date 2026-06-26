import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("DB successfully connected");
    }
    catch(error){
        console.log("MONGO DB connection error: ",error);
    }
}