import { getHotels } from "./api";

// Query backend for hotels; no local mock fallback
export async function searchHotels({
  q,
  checkIn,
  checkOut,
  rooms = 1,
  guests = 1,
}) {
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
