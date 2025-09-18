import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FiltersSidebar from "../components/FiltersSidebar";
import Footer from "../components/Footer";
import HotelCard from "../components/HotelCard";
import Navbar from "../components/Navbar";
import { hotels as seed } from "../data/hotels";

const Hotels = () => {
  // Expand mock data to look like a richer list (memoized)
  const base = useMemo(
    () => [...seed, ...seed.map((h, i) => ({ ...h, id: h.id + "x" + i }))],
    []
  );

  // URL-synced state
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [selectedPopular, setSelectedPopular] = useState(() =>
    (searchParams.get("popular") || "").split(",").filter(Boolean)
  );
  const [selectedCollections, setSelectedCollections] = useState(() =>
    (searchParams.get("collections") || "").split(",").filter(Boolean)
  );
  const [priceMax, setPriceMax] = useState(() => {
    const v = Number(searchParams.get("priceMax") || 4000);
    return Number.isFinite(v) && v > 0 ? v : 4000;
  });
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sortBy") || "popularity"
  );
  const [page, setPage] = useState(() => {
    const v = Number(searchParams.get("page") || 1);
    return Number.isFinite(v) && v > 0 ? v : 1;
  });
  const pageSize = 6;

  const togglePopular = (p) => {
    setSelectedPopular((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };
  const toggleCollection = (c) => {
    setSelectedCollections((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };
  const clearFilters = () => {
    setSelectedPopular([]);
    setSelectedCollections([]);
    setPriceMax(4000);
    setSortBy("popularity");
    setPage(1);
  };

  const hotels = useMemo(() => {
    let list = base.filter((h) => h.price <= priceMax);
    // popular filter: match if hotel.location contains any selected popular tag
    if (selectedPopular.length) {
      list = list.filter((h) =>
        selectedPopular.some((p) =>
          h.location?.toLowerCase().includes(p.toLowerCase())
        )
      );
    }
    // collections filter: for demo, map some strings to simple predicates
    if (selectedCollections.length) {
      list = list.filter((h) => {
        return selectedCollections.every((c) => {
          if (c.includes("Family")) return h.amenities?.includes("Reception");
          if (c.includes("Group")) return (h.amenities || []).length >= 3;
          if (c.includes("Airport"))
            return h.location?.toLowerCase().includes("airport");
          if (c.includes("Local IDs")) return true; // allow all for demo
          return true;
        });
      });
    }
    if (sortBy === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "rating")
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [base, priceMax, selectedPopular, selectedCollections, sortBy]);

  const total = hotels.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageItems = hotels.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamp page when filters shrink results
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Reset to first page when filters (not sort) change
  useEffect(() => {
    setPage(1);
  }, [selectedPopular, selectedCollections, priceMax]);

  // Push state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedPopular.length)
      params.set("popular", selectedPopular.join(","));
    if (selectedCollections.length)
      params.set("collections", selectedCollections.join(","));
    if (priceMax !== 4000) params.set("priceMax", String(priceMax));
    if (sortBy !== "popularity") params.set("sortBy", sortBy);
    if (page !== 1) params.set("page", String(page));
    setSearchParams(params);
  }, [
    selectedPopular,
    selectedCollections,
    priceMax,
    sortBy,
    page,
    setSearchParams,
  ]);

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        <FiltersSidebar
          selectedPopular={selectedPopular}
          onTogglePopular={togglePopular}
          priceMax={priceMax}
          onPriceChange={setPriceMax}
          selectedCollections={selectedCollections}
          onToggleCollection={toggleCollection}
          onClear={clearFilters}
        />
        <section className="space-y-5">
          <nav className="text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700 font-semibold">Hotels</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                {total} Stays found
              </h1>
              <p className="text-slate-600">
                Use filters to refine your search by location, price, and more.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1"
              >
                <option value="popularity">Popularity</option>
                <option value="priceAsc">Price (Low to High)</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(selectedPopular.length ||
            selectedCollections.length ||
            priceMax < 4000) && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedPopular.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePopular(p)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]"
                >
                  {p}
                  <span className="text-slate-500">×</span>
                </button>
              ))}
              {selectedCollections.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCollection(c)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300"
                >
                  {c}
                  <span className="text-slate-500">×</span>
                </button>
              ))}
              {priceMax < 4000 && (
                <button
                  onClick={() => setPriceMax(4000)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300"
                >
                  Max ₹{priceMax}
                  <span className="text-slate-500">×</span>
                </button>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-[var(--brand)] font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {pageItems.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-slate-600">
              Showing {total === 0 ? 0 : start + 1}–{end} of {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Hotels;
