import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Hotels from "./Hotels";
import Marketplace from "./Marketplace";

// Combined page that hosts both Hotels and Marketplace under one route with tabs
export default function Explore({ initialTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine active tab from prop, query fallback, then default
  const tab = useMemo(() => {
    const fromProp =
      initialTab && ["stays", "market"].includes(initialTab)
        ? initialTab
        : null;
    if (fromProp) return fromProp;
    const fromQuery = searchParams.get("tab");
    return ["stays", "market"].includes(fromQuery) ? fromQuery : "stays";
  }, [initialTab, searchParams]);

  const setTab = (next) => {
    const params = new URLSearchParams(location.search);
    // drop any legacy tab param
    params.delete("tab");
    const qs = params.toString();
    const base = next === "market" ? "/explore/market" : "/explore/stays";
    navigate(qs ? `${base}?${qs}` : base, { replace: false });
  };

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-card">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Explore</h1>
              <p className="text-slate-600 text-sm md:text-base">
                Find places to stay and discover guides, experiences, and local
                shops.
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setTab("stays")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === "stays"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Stays
              </button>
              <button
                type="button"
                onClick={() => setTab("market")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === "market"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Marketplace
              </button>
            </div>
          </div>
        </header>

        {tab === "stays" ? <Hotels embedded /> : <Marketplace embedded />}
      </main>
      <Footer />
    </>
  );
}
