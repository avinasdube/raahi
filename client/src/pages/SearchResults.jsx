import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchHotels } from "../api/search";
import FiltersSidebar from "../components/FiltersSidebar";
import Footer from "../components/Footer";
import HotelCard from "../components/HotelCard";
import Navbar from "../components/Navbar";

export default function SearchResults() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    const dates = new URLSearchParams(location.search).get("dates") || "";
    const rooms = Number(
      new URLSearchParams(location.search).get("rooms") || 1
    );
    const guests = Number(
      new URLSearchParams(location.search).get("guests") || 1
    );
    setLoading(true);
    searchHotels({ q, checkIn: dates, checkOut: dates, rooms, guests })
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.meta?.total ?? res.items?.length ?? 0);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        <FiltersSidebar />
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              {loading ? "Searching…" : `${total} stays found`}
            </h1>
            <div className="hidden md:flex items-center gap-3 text-sm">
              <span>Sort by</span>
              <select className="border border-slate-300 rounded-lg px-2 py-1">
                <option>Popularity</option>
                <option>Price (Low to High)</option>
              </select>
            </div>
          </div>
          {!loading && items.map((h) => <HotelCard key={h.id} hotel={h} />)}
        </section>
      </main>
      <Footer />
    </>
  );
}
