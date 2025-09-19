import Hotel from "../models/Hotel.js";

function buildImagesForHotel(h) {
  const seedBase = encodeURIComponent(
    `${h.name || "Hotel"}-${h.location || "City"}`
  );
  const sizes = [
    [1200, 800],
    [800, 600],
    [800, 600],
    [800, 600],
  ];
  const images = sizes.map(
    ([w, v], idx) => `https://picsum.photos/seed/${seedBase}-${idx}/${w}/${v}`
  );
  return images;
}

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
    const enhanced = data.map((h) => {
      const images = buildImagesForHotel(h);
      return {
        ...h,
        image: h.image || images[0],
        images,
      };
    });
    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    const images = buildImagesForHotel(hotel);
    res.json({ ...hotel, image: hotel.image || images[0], images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
