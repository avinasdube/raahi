import mongoose from "mongoose";

const POISchema = new mongoose.Schema({
  name: String,
  city: String,
  time: String,
  tip: String,
  category: String, // e.g., "historical", "beach", "food", etc.
});

export default mongoose.model("POI", POISchema);
