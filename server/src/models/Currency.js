import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema({
  base: String,
  rates: Object,
  last_updated: { type: Date, default: Date.now },
});

export default mongoose.model("Currency", CurrencySchema);
