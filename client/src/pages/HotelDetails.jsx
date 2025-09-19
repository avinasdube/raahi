import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getHotel } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fallback to city centers if coords missing
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        const { data } = await getHotel(id);
        if (!mounted) return;
        setHotel(data);
      } catch (e) {
        console.error("Hotel fetch error", e);
        if (!mounted) return;
        setError("Failed to load hotel");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!latlng) return;
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
      const map = L.map(mapRef.current).setView([lat, lng], 13);
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
  }, [latlng, hotel?.name]);
  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 grid lg:grid-cols-[1fr_360px] gap-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
            <img
              src={hotel?.image}
              alt={hotel?.name || "Hotel image"}
              className="col-span-2 h-60 md:h-80 w-full object-cover"
            />
            <img
              src={hotel?.image}
              alt=""
              className="h-28 md:h-40 w-full object-cover"
            />
            <img
              src={hotel?.image}
              alt=""
              className="h-28 md:h-40 w-full object-cover"
            />
            <img
              src={hotel?.image}
              alt=""
              className="h-28 md:h-40 w-full object-cover hidden md:block"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold mt-4">
            {hotel?.name || "Hotel"}
          </h1>
          <p className="text-slate-600">{hotel?.location}</p>

          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {(hotel?.amenities || []).map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Location</h2>
            {latlng ? (
              <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                <div ref={mapRef} className="h-full w-full" />
              </div>
            ) : (
              <div className="h-64 rounded-xl bg-slate-200 flex items-center justify-center">
                Location map not available
              </div>
            )}
          </div>
        </section>

        <aside className="bg-white rounded-2xl border border-slate-200 p-4 h-max sticky top-24 shadow-card">
          <div className="text-3xl font-extrabold">₹{hotel?.price ?? "--"}</div>
          <div className="text-sm text-slate-500">
            + taxes & fees · per room per night
          </div>
          <button className="btn btn-primary w-full mt-4">Book Now</button>
          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </aside>
      </main>
      <Footer />
    </>
  );
}
