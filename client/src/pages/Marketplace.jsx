import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const data = [
  {
    id: "h1",
    type: "Hotel",
    name: "Hotel Surya Palace",
    city: "Jaipur",
    price: 2200,
    rating: 4.2,
  },
  {
    id: "h2",
    type: "Homestay",
    name: "Goa Beach Homestay",
    city: "Goa",
    price: 1800,
    rating: 4.5,
  },
  {
    id: "g1",
    type: "Guide",
    name: "Ravi (Heritage Walk)",
    city: "Delhi",
    price: 800,
    rating: 4.8,
  },
  {
    id: "e1",
    type: "Experience",
    name: "Old Delhi Food Crawl",
    city: "Delhi",
    price: 1200,
    rating: 4.7,
  },
  {
    id: "s1",
    type: "Shop",
    name: "Handicrafts Bazaar",
    city: "Jaipur",
    price: 0,
    rating: 4.4,
  },
];

export default function Marketplace({ embedded = false }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [city, setCity] = useState("All");

  const items = useMemo(() => {
    return data.filter(
      (d) =>
        (type === "All" || d.type === type) &&
        (city === "All" || d.city === city) &&
        (q === "" || d.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, type, city]);

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
            className="border border-slate-300 rounded-lg h-10 px-3"
          >
            {["All", "Hotel", "Homestay", "Guide", "Experience", "Shop"].map(
              (t) => (
                <option key={t}>{t}</option>
              )
            )}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-slate-300 rounded-lg h-10 px-3"
          >
            {["All", "Jaipur", "Delhi", "Goa"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button className="btn btn-primary">Filter</button>
        </section>
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
                Rating: {it.rating} {it.price ? `• From ₹${it.price}` : ""}
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-outline">View</button>
                <button className="btn btn-primary">Book / Contact</button>
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
