// app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js"
const app = express();

app.use(cors());

app.use(express.json());

app.use ("/api/v1",routes);

// Orta katman (middleware) ve route eklemeleri buraya
app.get("/", (req, res) => {
  res.send("Fiyatla API çalışıyor 🚀");
});

export default app;
