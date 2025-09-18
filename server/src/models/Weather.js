import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  condition: String,
  humidity: Number,
  forecast: [
    {
      day: String,
      temp: Number,
      condition: String,
    },
  ],
  last_updated: { type: Date, default: Date.now },
});

export default mongoose.model("Weather", WeatherSchema);
