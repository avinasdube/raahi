import Hotel from "../models/Hotel.js";

export const getAllHotels = async (req, res) => {
  try {
    const data = await Hotel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
