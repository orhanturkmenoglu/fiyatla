// app.js
import express from "express";
import colors from "colors";
import productRoute from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());


app.use("/api/v1", productRoute);

// Orta katman (middleware) ve route eklemeleri buraya
app.get("/", (req, res) => {
  res.send("Fiyatla API çalışıyor 🚀");
});

export default app;
