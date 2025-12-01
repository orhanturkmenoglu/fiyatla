// server.js
import dotenv from "dotenv";
import colors from "colors";
import app from "./app.js";
import connectDB from "./config/db.js";
import path from "path";

dotenv.config({path : path.resolve("./config/.env")}); 

connectDB();

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(
    colors.green(
      `🚀 Node Server Running in ${process.env.DEV_MODE || "development"} mode on port ${PORT}`
    )
  );
});
