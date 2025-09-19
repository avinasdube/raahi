import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels, getPOIs } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Marketplace({ embedded = false }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [city, setCity] = useState("All");
  const [hotels, setHotels] = useState([]);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [hRes, pRes] = await Promise.all([
          getHotels(city === "All" ? "" : city),
          city === "All" ? Promise.resolve({ data: [] }) : getPOIs(city),
        ]);
        if (!mounted) return;
        setHotels(Array.isArray(hRes.data) ? hRes.data : []);
        setPois(Array.isArray(pRes.data) ? pRes.data : []);
      } catch (e) {
        if (!mounted) return;
        console.error("Marketplace fetch error", e);
        setError("Failed to load marketplace data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [city]);

  const items = useMemo(() => {
    const hotelItems = hotels.map((h) => ({
      id: h._id || h.id,
      type: "Hotel",
      name: h.name,
      city: (h.location || "").split(",")[0] || h.location || "",
      price: Number(h.price) || 0,
      rating: Number(h.rating) || 0,
    }));
    const poiItems = pois.map((p) => ({
      id: p._id || p.id,
      type: p.category?.toLowerCase().includes("shop") ? "Shop" : "Experience",
      name: p.name,
      city: p.city,
      price: 0,
      rating: 4.5,
    }));
    const merged = [...hotelItems, ...poiItems];
    return merged.filter(
      (d) =>
        (type === "All" || d.type === type) &&
        (city === "All" || d.city === city) &&
        (q === "" || d.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, type, city, hotels, pois]);

  return (
    <>
      {!embedded && <Navbar />}
      <main
        className={`container ${
          embedded ? "pt-0" : "pt-24 md:pt-28"
        } pb-10 space-y-6`}
      >
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Tourism Marketplace
          </h1>
          <p className="text-slate-600">
            Connect with hotels, homestays, guides, experiences, and local
            businesses — India-first, UPI-ready, with loyalty rewards coming
            soon.
          </p>
        </header>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card flex flex-wrap gap-3 items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search listings"
            className="flex-1 min-w-[220px] border border-slate-300 rounded-lg h-10 px-3"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select-control"
          >
            {["All", "Hotel", "Experience", "Shop"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="select-control"
          >
            {[
              "All",
              "Jaipur",
              "Delhi",
              "Goa",
              "Mumbai",
              "Udaipur",
              "Manali",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </section>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {loading && (
          <div className="text-sm text-slate-600">Loading listings…</div>
        )}
        <section className="grid md:grid-cols-3 gap-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <div className="text-xs text-slate-500">
                {it.type} • {it.city}
              </div>
              <div className="text-lg font-semibold">{it.name}</div>
              <div className="text-sm text-slate-600">
                Rating: {Math.round(Number(it.rating) || 0)}{" "}
                {it.price ? `• From ₹${it.price}` : ""}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    if (it.type === "Hotel") {
                      navigate(`/hotel/${it.id}`);
                    } else {
                      const q = encodeURIComponent(`${it.name} ${it.city}`);
                      window.open(
                        `https://www.google.com/maps/search/${q}`,
                        "_blank",
                        "noreferrer"
                      );
                    }
                  }}
                >
                  View
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (it.type === "Hotel") {
                      navigate(`/hotel/${it.id}`);
                    } else {
                      const q = encodeURIComponent(`${it.name} ${it.city}`);
                      window.open(
                        `https://www.google.com/maps/search/${q}`,
                        "_blank",
                        "noreferrer"
                      );
                    }
                  }}
                >
                  Book / Contact
                </button>
              </div>
            </div>
          ))}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="text-xl font-bold mb-2">Payments & Rewards</h2>
          <p className="text-slate-600 text-sm">
            UPI-ready checkout placeholder. Earn and redeem loyalty points
            across partner stays and experiences (mock UI).
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <button className="btn btn-outline">Pay with UPI</button>
            <button className="btn btn-outline">Apply Rewards</button>
            <button className="btn btn-outline">Partner with us</button>
          </div>
        </section>
      </main>
      {!embedded && <Footer />}
    </>
  );
}
