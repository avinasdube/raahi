import mongoose from "mongoose";

const CrowdSchema = new mongoose.Schema({
  place: String,
  crowd_level: String,
  percent: Number,
  last_updated: { type: Date, default: Date.now },
});

export default mongoose.model("Crowd", CrowdSchema);
