import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HotelCard({ hotel, showMap = false }) {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fallback to city centers if coords are missing
  const CITY_CENTERS = {
    Agra: { lat: 27.1767, lng: 78.0081 },
    Varanasi: { lat: 25.3176, lng: 82.9739 },
    Manali: { lat: 32.2396, lng: 77.1887 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
    Goa: { lat: 15.2993, lng: 74.124 },
    Delhi: { lat: 28.6139, lng: 77.209 },
    "New Delhi": { lat: 28.6139, lng: 77.209 },
    Mumbai: { lat: 19.076, lng: 72.8777 },
  };
  const deriveLatLng = () => {
    if (
      hotel?.coords &&
      typeof hotel.coords.lat === "number" &&
      typeof hotel.coords.lng === "number"
    ) {
      return { lat: hotel.coords.lat, lng: hotel.coords.lng };
    }
    const location = hotel?.location || "";
    for (const city of Object.keys(CITY_CENTERS)) {
      if (location.toLowerCase().includes(city.toLowerCase())) {
        return CITY_CENTERS[city];
      }
    }
    const parts = location
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && CITY_CENTERS[last]) return CITY_CENTERS[last];
    return null;
  };
  const latlng = deriveLatLng();
  const hasCoords = !!latlng;

  useEffect(() => {
    if (!showMap || !hasCoords) return;
    let disposed = false;
    const ensureLeaflet = async () => {
      if (!document.querySelector("link[data-leaflet]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "1");
        document.head.appendChild(link);
      }
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
    };
    ensureLeaflet().then(() => {
      if (disposed || mapInstanceRef.current || !mapRef.current) return;
      const L = window.L;
      const { lat, lng } = latlng;
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      L.marker([lat, lng]).addTo(map).bindPopup(hotel.name);
      mapInstanceRef.current = map;
    });
    return () => {
      disposed = true;
      try {
        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;
      } catch {
        /* noop */
      }
    };
  }, [showMap, hasCoords, latlng, hotel?.name]);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card group">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        <div className="relative h-56 md:h-52">
          <img
            src={
              (hotel.images && hotel.images[0]) ||
              hotel.image ||
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop"
            }
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Raahi Select
          </div>
        </div>
        <div className="p-4 md:p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <Link
                to={`/hotel/${hotel.id || hotel._id}`}
                className="text-lg md:text-xl font-bold hover:text-[var(--brand)]"
              >
                {hotel.name}
              </Link>
              <div className="text-slate-600 text-sm">{hotel.location}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700 mt-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">
                  {Math.round(Number(hotel.rating) || 0)}★
                </span>
                {hotel.reviews && <span>({hotel.reviews} Ratings)</span>}
                {hotel.badge && <span>• {hotel.badge}</span>}
              </div>
            </div>
            {hotel.socialProof && (
              <div className="text-xs text-red-500">🔥 {hotel.socialProof}</div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
            {(hotel.amenities || []).map((a) => (
              <span key={a} className="inline-flex items-center gap-2">
                • {a}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-2xl font-extrabold">
                ₹{hotel.price}
                <span className="ml-2 text-slate-400 line-through text-base font-medium">
                  ₹
                  {hotel.originalPrice ||
                    Math.round((Number(hotel.price) || 0) * 1.15)}
                </span>
                <span className="ml-2 text-green-600 text-sm font-bold">
                  {hotel.discount ??
                    (() => {
                      const price = Number(hotel.price) || 0;
                      const original = Math.round(price * 1.15);
                      return price > 0
                        ? Math.round(((original - price) / original) * 100)
                        : 0;
                    })()}
                  % off
                </span>
              </div>
              <div className="text-xs text-slate-500">
                + taxes & fees · per room per night
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/hotel/${hotel.id || hotel._id}`}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                View Details
              </Link>
              <Link
                to={
                  user
                    ? `/hotel/${hotel.id || hotel._id}`
                    : `/auth?next=${encodeURIComponent(
                        `/hotel/${hotel.id || hotel._id}`
                      )}`
                }
                className="btn btn-primary"
              >
                {user ? "Book Now" : "Login to Book"}
              </Link>
            </div>
          </div>

          {showMap && hasCoords && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
              <div ref={mapRef} className="h-40 w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
