import Weather from "../models/Weather.js";

export const getAllWeather = async (req, res) => {
  try {
    const data = await Weather.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
