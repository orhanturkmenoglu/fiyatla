// app.js
import express from "express";
import colors from "colors";

const app = express();

// Orta katman (middleware) ve route eklemeleri buraya
app.get("/", (req, res) => {
  res.send("Fiyatla API çalışıyor 🚀");
});

export default app;
