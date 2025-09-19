import { getHotels } from "./api";

// Always try real backend; gracefully fall back to local mock if it fails
export async function searchHotels({
  q,
  checkIn,
  checkOut,
  rooms = 1,
  guests = 1,
}) {
  try {
    const { data } = await getHotels({ q });
    return {
      items: Array.isArray(data) ? data : [],
      meta: {
        total: Array.isArray(data) ? data.length : 0,
        q,
        checkIn,
        checkOut,
        rooms,
        guests,
      },
    };
  } catch {
    const { hotels } = await import("../data/hotels");
    const filtered = hotels.filter(
      (h) =>
        h.name.toLowerCase().includes((q || "").toLowerCase()) ||
        h.location.toLowerCase().includes((q || "").toLowerCase())
    );
    return {
      items: filtered,
      meta: { total: filtered.length, q, checkIn, checkOut, rooms, guests },
    };
  }
}
