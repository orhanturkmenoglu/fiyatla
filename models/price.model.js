import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  market: {
    type: String,
    required: true,
    enum: ["A101", "Migros", "Carrefour", "Şok", "Bim", "Metro", "Trendyol"],
    default : "Bim"
  },
  price : {
    type : Number ,
    required : true
  },
  url: {
    type: String, // ürünün marketteki sayfa linki
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  }
});


export default priceSchema ; 