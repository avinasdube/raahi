import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  rating: Number,
  available: Boolean,
});

export default mongoose.model("Hotel", HotelSchema);
