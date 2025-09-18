import client from "./axios";

// This is an API facade so form components can reuse it later
export async function searchHotels({
  q,
  checkIn,
  checkOut,
  rooms = 1,
  guests = 1,
}) {
  // For now, we mock the response locally to avoid backend dependency.
  // If VITE_API_BASE_URL is set, this will call your backend.
  const useMock = !import.meta.env.VITE_API_BASE_URL;
  if (useMock) {
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
  const res = await client.get("/hotels/search", {
    params: { q, checkIn, checkOut, rooms, guests },
  });
  return res.data;
}
