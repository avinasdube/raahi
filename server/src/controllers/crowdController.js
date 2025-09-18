import Crowd from "../models/Crowd.js";

export const getAllCrowd = async (req, res) => {
  try {
    const data = await Crowd.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
