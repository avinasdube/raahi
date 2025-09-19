import POI from "../models/POI.js";

export const getAllPOIs = async (req, res) => {
  try {
    const data = await POI.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPOIsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const data = await POI.find({ city: new RegExp(city, "i") });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
