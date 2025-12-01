import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path : path.resolve("./config/.env")}); 

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    console.log(
      colors.bgMagenta(`✅ Connected to MongoDB: ${connection.host}`)
    );
  } catch (error) {
    console.error(colors.red(`❌ MongoDB connection error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
