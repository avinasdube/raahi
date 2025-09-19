import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  rating: Number,
  available: Boolean,
  image: String,
  amenities: [String],
  reviews: Number,
  badge: String,
  socialProof: String,
  coords: {
    lat: Number,
    lng: Number,
  },
});

export default mongoose.model("Hotel", HotelSchema);
