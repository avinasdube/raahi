import Hotel from "../models/Hotel.js";

export const getAllHotels = async (req, res) => {
  try {
    const { q, location } = req.query || {};
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    const data = await Hotel.find(filter).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
