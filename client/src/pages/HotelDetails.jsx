import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getHotel } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

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
  const city = useMemo(() => hotel?.location || "", [hotel]);

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
            {(() => {
              const imgs =
                hotel?.images && hotel.images.length
                  ? hotel.images
                  : [
                      hotel?.image,
                      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1501117716987-c8e9226e6b67?q=80&w=1200&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop",
                    ].filter(Boolean);
              const [first, ...rest] = imgs;
              return (
                <>
                  <img
                    src={first}
                    alt={hotel?.name || "Hotel image"}
                    className="col-span-2 h-60 md:h-80 w-full object-cover"
                  />
                  {rest.slice(0, 3).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className={`h-28 md:h-40 w-full object-cover ${
                        i === 2 ? "hidden md:block" : ""
                      }`}
                    />
                  ))}
                </>
              );
            })()}
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

        <aside className="bg-white rounded-2xl border border-slate-200 p-4 h-max sticky top-24 shadow-card space-y-4">
          <div>
            <div className="text-3xl font-extrabold">
              ₹{hotel?.price ?? "--"}
            </div>
            <div className="text-sm text-slate-500">
              + taxes & fees · per room per night
            </div>
          </div>

          {/* Payment methods */}
          <BookingWidget price={hotel?.price} hotelName={hotel?.name} />

          {/* Getting there */}
          <GettingThere city={city} />

          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </aside>
      </main>
      <Footer />
    </>
  );
}

function BookingWidget({ price = 0, hotelName = "" }) {
  const { user } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState("upi");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const confirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    // simulate processing
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStatus("success");
  };

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return (
      <div className="border border-slate-200 rounded-xl p-3">
        <div className="text-sm font-semibold mb-2">Book your stay</div>
        <p className="text-sm text-slate-600 mb-2">
          Please log in to continue with booking.
        </p>
        <Link to={`/auth?next=${next}`} className="btn btn-primary w-full h-11">
          Login to Book
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="text-sm font-semibold mb-2">Book your stay</div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {[
          { key: "upi", label: "UPI" },
          { key: "card", label: "Card" },
          { key: "net", label: "NetBanking" },
          { key: "wallet", label: "Wallet" },
          { key: "pay", label: "Pay at Hotel" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setMode(t.key)}
            aria-pressed={mode === t.key}
            className={`px-3 py-2 rounded-lg border text-sm ${
              mode === t.key
                ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                : "border-slate-300 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={confirm} className="space-y-2">
        {mode === "upi" && (
          <div>
            <label className="text-sm text-slate-600">UPI ID</label>
            <input
              type="text"
              placeholder="name@bank"
              required
              className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3"
            />
          </div>
        )}
        {mode === "card" && (
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="text-sm text-slate-600">Card number</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                required
                className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-slate-600">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">CVV</label>
                <input
                  type="password"
                  placeholder="***"
                  required
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600">Name on card</label>
              <input
                type="text"
                placeholder="Full name"
                required
                className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3"
              />
            </div>
          </div>
        )}

        {mode === "net" && (
          <div>
            <label className="text-sm text-slate-600">Select bank</label>
            <select className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3">
              {["HDFC", "SBI", "ICICI", "Axis", "Kotak"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {mode === "wallet" && (
          <div>
            <label className="text-sm text-slate-600">Choose wallet</label>
            <select className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3">
              {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"].map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>
        )}

        {mode === "pay" && (
          <div className="text-sm text-slate-600">
            Reserve now, pay at the property.
          </div>
        )}

        <button className="btn btn-primary w-full h-11" disabled={loading}>
          {loading ? "Processing…" : `Confirm ₹${price || "--"}`}
        </button>
        {status === "success" && (
          <div className="text-green-600 text-sm">
            Booking confirmed for {hotelName}!
          </div>
        )}
      </form>
    </div>
  );
}

function GettingThere({ city = "" }) {
  const suggestions = useMemo(() => {
    const base = [
      {
        icon: "🚕",
        title: "Cab / Taxi",
        desc: "Direct ride from airport or station.",
      },
      {
        icon: "🚌",
        title: "Bus",
        desc: "Local or intercity buses are frequent.",
      },
      {
        icon: "🚇",
        title: "Metro / Rail",
        desc: "Use nearest metro/rail stop then a short cab.",
      },
      {
        icon: "🚶",
        title: "Walkability",
        desc: "Short walks for nearby attractions.",
      },
    ];
    const cityAdds = {
      Jaipur: [
        {
          icon: "🛺",
          title: "Auto rickshaw",
          desc: "Best for old city lanes.",
        },
      ],
      Goa: [
        {
          icon: "🛵",
          title: "Scooter rental",
          desc: "Popular for beach hopping.",
        },
      ],
      Agra: [
        {
          icon: "🛺",
          title: "Auto rickshaw",
          desc: "Easy access to Taj and Fort.",
        },
      ],
      Varanasi: [
        {
          icon: "⛵",
          title: "Boat",
          desc: "Use ghats for boat rides at sunrise.",
        },
      ],
      Manali: [
        {
          icon: "🚐",
          title: "Shared cab",
          desc: "For valley transfers and sightseeing.",
        },
      ],
    };
    return [...base, ...(cityAdds[city] || [])];
  }, [city]);

  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="text-sm font-semibold mb-2">Getting there</div>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="text-lg leading-none">{s.icon}</span>
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-slate-500 text-xs">{s.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
