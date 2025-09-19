import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { getCrowd, getHotels, getPOIs, getWeather } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { showError } from "../utils/toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [city, setCity] = useState("Jaipur");
  const [weather, setWeather] = useState([]);
  const [crowd, setCrowd] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [pois, setPOIs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [wRes, cRes, hRes, pRes] = await Promise.all([
          getWeather(),
          getCrowd(),
          getHotels(city),
          getPOIs(city),
        ]);
        if (!mounted) return;
        setWeather(Array.isArray(wRes.data) ? wRes.data : []);
        setCrowd(Array.isArray(cRes.data) ? cRes.data : []);
        setHotels(Array.isArray(hRes.data) ? hRes.data : []);
        setPOIs(Array.isArray(pRes.data) ? pRes.data : []);
      } catch {
        showError("Failed fetching dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [city]);

  // Weather trend: pick the latest weather doc for the selected city by last_updated
  const cityWeather = useMemo(() => {
    const inCity = weather.filter(
      (w) => w.city?.toLowerCase() === city.toLowerCase()
    );
    if (!inCity.length) return undefined;
    return inCity.reduce((latest, curr) => {
      const l = new Date(
        latest?.last_updated || latest?.lastUpdated || 0
      ).getTime();
      const c = new Date(
        curr?.last_updated || curr?.lastUpdated || 0
      ).getTime();
      return c > l ? curr : latest;
    }, inCity[0]);
  }, [weather, city]);
  const weatherTrend = useMemo(() => {
    const labels = cityWeather?.forecast?.map((f) => f.day) || [];
    const temps = cityWeather?.forecast?.map((f) => f.temp) || [];
    return {
      labels,
      datasets: [
        {
          label: "Temp (°C)",
          data: temps,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.25)",
          tension: 0.3,
        },
      ],
    };
  }, [cityWeather]);

  // Crowd levels: prefer places that belong to selected city (from POIs),
  // fallback to keyword includes when POIs are unavailable
  const crowdTrend = useMemo(() => {
    const allowed = new Set(
      (pois || []).map((p) => String(p.name || "").toLowerCase())
    );
    let inCity = [];
    if (allowed.size > 0) {
      inCity = crowd.filter((c) =>
        allowed.has(String(c.place || "").toLowerCase())
      );
    } else {
      inCity = crowd.filter((c) =>
        c.place?.toLowerCase().includes(city.toLowerCase())
      );
    }
    const labels = inCity.map((c) => c.place);
    const perc = inCity.map((c) => Number(c.percent) || 0);
    return {
      labels,
      datasets: [
        {
          label: "Crowd %",
          data: perc,
          backgroundColor: "rgba(239, 68, 68, 0.45)",
          borderColor: "#ef4444",
        },
      ],
    };
  }, [crowd, city, pois]);

  // Price distribution for city hotels
  const hotelPrices = useMemo(() => {
    const labels = hotels.map((h) => h.name);
    const prices = hotels.map((h) => Number(h.price) || 0);
    return {
      labels,
      datasets: [
        {
          label: "Price (₹)",
          data: prices,
          backgroundColor: "rgba(16, 185, 129, 0.45)",
          borderColor: "#10b981",
        },
      ],
    };
  }, [hotels]);

  // Best time to visit heatmap (simple):
  // Compute a score per weekday from forecast temp (mild temps better) and inferred crowd (lower is better)
  const heatmap = useMemo(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const wByDay = new Map();
    cityWeather?.forecast?.forEach((f) => wByDay.set(f.day, f.temp));
    const crowdByPlace = crowd.filter((c) =>
      c.place?.toLowerCase().includes(city.toLowerCase())
    );
    // naive: average crowd percent for this city
    const avgCrowd = crowdByPlace.length
      ? crowdByPlace.reduce((a, b) => a + (Number(b.percent) || 0), 0) /
        crowdByPlace.length
      : 50;
    const data = days.map((d) => {
      const temp = wByDay.has(d) ? wByDay.get(d) : null;
      // Favor 18–28C; penalty outside
      const tempScore =
        temp == null ? 0 : Math.max(0, 30 - Math.abs(23 - temp));
      const crowdScore = 100 - avgCrowd; // lower crowd -> higher score
      return Math.max(0, Math.round((tempScore * 2 + crowdScore) / 3));
    });
    return { labels: days, data };
  }, [cityWeather, crowd, city]);

  // Derive actionable insights for a friendly report section
  const insights = useMemo(() => {
    // Best day from heatmap
    let bestDay = null;
    if (heatmap.labels?.length && heatmap.data?.length) {
      const idx = heatmap.data.indexOf(Math.max(...heatmap.data));
      bestDay = heatmap.labels[idx];
    }

    // Crowd in selected city (reuse logic similar to crowdTrend)
    const allowed = new Set(
      (pois || []).map((p) => String(p.name || "").toLowerCase())
    );
    let inCity = [];
    if (allowed.size > 0) {
      inCity = crowd.filter((c) =>
        allowed.has(String(c.place || "").toLowerCase())
      );
    } else {
      inCity = crowd.filter((c) =>
        c.place?.toLowerCase().includes(city.toLowerCase())
      );
    }
    const mostCrowded = inCity.length
      ? inCity.reduce((a, b) =>
          (Number(a.percent) || 0) > (Number(b.percent) || 0) ? a : b
        )
      : null;
    const leastCrowded = inCity.length
      ? inCity.reduce((a, b) =>
          (Number(a.percent) || 0) < (Number(b.percent) || 0) ? a : b
        )
      : null;

    // Prices from loaded hotels
    const priceList = hotels
      .map((h) => Number(h.price) || 0)
      .filter((n) => Number.isFinite(n) && n > 0);
    const avgPrice = priceList.length
      ? Math.round(priceList.reduce((a, b) => a + b, 0) / priceList.length)
      : null;
    const cheapest = hotels.length
      ? hotels.reduce((a, b) =>
          (Number(a.price) || Infinity) < (Number(b.price) || Infinity) ? a : b
        )
      : null;
    const budgetPicks = [...hotels]
      .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
      .slice(0, 3);

    // Weather callout
    const weatherCond = cityWeather?.condition || null;
    const tempNow = cityWeather?.temperature ?? null;

    return {
      bestDay,
      mostCrowded,
      leastCrowded,
      avgPrice,
      cheapest,
      budgetPicks,
      weatherCond,
      tempNow,
    };
  }, [heatmap, pois, crowd, city, hotels, cityWeather]);

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Travel Insights Dashboard
            </h1>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="select-control"
            >
              {["Jaipur", "Agra", "Goa", "Varanasi", "Manali"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <p className="text-slate-600">
            Visualize crowd, price, and weather trends—no dummy data.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold mb-2">Weather Trend (Forecast)</h2>
            {loading ? (
              <div className="text-slate-500">Loading…</div>
            ) : (
              <Line
                data={weatherTrend}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                    },
                    tooltip: {
                      titleColor: "#0f172a",
                      bodyColor: "#0f172a",
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderColor: "rgba(15,23,42,0.15)",
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                      grid: { color: "rgba(148,163,184,0.2)" },
                    },
                    y: {
                      ticks: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                      grid: { color: "rgba(148,163,184,0.2)" },
                    },
                  },
                }}
              />
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold mb-2">Crowd Levels by Place</h2>
            {loading ? (
              <div className="text-slate-500">Loading…</div>
            ) : (
              <Bar
                data={crowdTrend}
                options={{
                  indexAxis: "y",
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                    },
                    tooltip: {
                      titleColor: "#0f172a",
                      bodyColor: "#0f172a",
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderColor: "rgba(15,23,42,0.15)",
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                      grid: { color: "rgba(148,163,184,0.2)" },
                    },
                    y: {
                      ticks: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                      grid: { color: "rgba(148,163,184,0.2)" },
                    },
                  },
                }}
              />
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold mb-2">Hotel Price Distribution</h2>
            {loading ? (
              <div className="text-slate-500">Loading…</div>
            ) : (
              <Bar
                data={hotelPrices}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                    },
                    tooltip: {
                      titleColor: "#0f172a",
                      bodyColor: "#0f172a",
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderColor: "rgba(15,23,42,0.15)",
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                      grid: { color: "rgba(148,163,184,0.2)" },
                    },
                    y: {
                      ticks: {
                        color:
                          getComputedStyle(
                            document.documentElement
                          ).getPropertyValue("--text") || "#0f172a",
                      },
                      grid: { color: "rgba(148,163,184,0.2)" },
                    },
                  },
                }}
              />
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold mb-2">
              Best Time to Visit (Heatmap)
            </h2>
            {/* Simple horizontal heatmap using colored bars */}
            <div className="space-y-2">
              {heatmap.labels.map((label, idx) => {
                const v = heatmap.data[idx];
                const isDark =
                  document.documentElement.classList.contains("dark");
                const color =
                  v > 75
                    ? isDark
                      ? "#34d399"
                      : "#10b981"
                    : v > 50
                    ? isDark
                      ? "#a3e635"
                      : "#84cc16"
                    : v > 25
                    ? isDark
                      ? "#fbbf24"
                      : "#f59e0b"
                    : isDark
                    ? "#f87171"
                    : "#ef4444";
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-28 text-sm text-slate-600">{label}</span>
                    <div className="flex-1 h-5 rounded bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-5 rounded"
                        style={{ width: `${v}%`, backgroundColor: color }}
                        title={`${v}% suitability`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Insightful summary/report */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-xl font-bold mb-3">
            Smart Travel Report for {city}
          </h2>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500 mb-1">Best time</div>
              <div className="text-2xl font-extrabold">
                {insights.bestDay ? insights.bestDay : "–"}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {insights.weatherCond
                  ? `Forecast: ${insights.weatherCond}`
                  : ""}
                {insights.tempNow != null ? ` • ${insights.tempNow}°C now` : ""}
              </div>
              <ul className="mt-3 text-sm text-slate-700 list-disc pl-4 space-y-1">
                <li>Plan outdoor sights on the best day above.</li>
                <li>Keep a backup indoor activity for heat or rain.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500 mb-1">Price insight</div>
              <div className="text-2xl font-extrabold">
                {insights.avgPrice != null
                  ? `₹${insights.avgPrice.toLocaleString("en-IN")}`
                  : "–"}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Average per-night price in current listings
              </div>
              {insights.cheapest && (
                <div className="mt-3 text-sm">
                  Lowest today:{" "}
                  <span className="font-semibold">
                    ₹{Number(insights.cheapest.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-slate-600">
                    {" "}
                    at {insights.cheapest.name}
                  </span>
                </div>
              )}
              {insights.budgetPicks?.length > 0 && (
                <ul className="mt-2 text-sm text-slate-700 space-y-1">
                  {insights.budgetPicks.map((h) => (
                    <li
                      key={h._id || h.id}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate mr-2">{h.name}</span>
                      <span className="font-semibold">
                        ₹{Number(h.price).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500 mb-1">Crowd guidance</div>
              <div className="text-sm text-slate-700">
                {insights.mostCrowded ? (
                  <>
                    Busiest:{" "}
                    <span className="font-semibold">
                      {insights.mostCrowded.place}
                    </span>{" "}
                    (
                    <span className="font-semibold">
                      {Number(insights.mostCrowded.percent)}%
                    </span>
                    )
                  </>
                ) : (
                  "–"
                )}
              </div>
              {insights.leastCrowded && (
                <div className="text-sm text-slate-700 mt-1">
                  Quietest:{" "}
                  <span className="font-semibold">
                    {insights.leastCrowded.place}
                  </span>{" "}
                  (
                  <span className="font-semibold">
                    {Number(insights.leastCrowded.percent)}%
                  </span>
                  )
                </div>
              )}
              <ul className="mt-3 text-sm text-slate-700 list-disc pl-4 space-y-1">
                <li>Visit quieter spots earlier in the day.</li>
                <li>Pre-book tickets near busy areas to skip lines.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
