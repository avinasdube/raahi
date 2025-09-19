import { getHotels } from "./api";

// This is an API facade so form components can reuse it later
export async function searchHotels({
  q,
  checkIn,
  checkOut,
  rooms = 1,
  guests = 1,
}) {
  // Use backend when configured, otherwise fallback to local mock.
  const useBackend = !!import.meta.env.VITE_API_BASE_URL;
  if (!useBackend) {
    const { hotels } = await import("../data/hotels");
    // naive filter by name or location
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
}
