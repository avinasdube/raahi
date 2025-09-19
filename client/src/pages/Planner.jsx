import { useEffect, useMemo, useState } from "react";
import { getCrowd, getPOIs, getWeather, postAIPlan } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { showError, showSuccess } from "../utils/toast";

const interestsList = [
  "Historical sites",
  "Beaches",
  "Mountains",
  "Food & cafes",
  "Shopping",
  "Wildlife & nature",
  "Festivals & culture",
];

export default function Planner() {
  const [city, setCity] = useState("Jaipur");
  const [budget, setBudget] = useState(20000);
  const [days, setDays] = useState(3);
  const [season, setSeason] = useState("Winter");
  const [interests, setInterests] = useState(["Historical sites"]);
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Data state
  const [weatherData, setWeatherData] = useState([]);
  const [crowdData, setCrowdData] = useState([]);
  // Hotels are fetched server-side for AI; client may not need full list here
  // Hotels are fetched on the server for AI planning
  const [poisData, setPoisData] = useState([]);

  // Fetch data on mount and when city changes
  useEffect(() => {
    // Prefill from Trips if available
    try {
      const raw = localStorage.getItem("raahi.plannerPrefill");
      if (raw) {
        const pre = JSON.parse(raw);
        if (pre.city) setCity(pre.city);
        if (Number.isFinite(pre.budget)) setBudget(pre.budget);
        if (Number.isFinite(pre.days)) setDays(pre.days);
        if (pre.season) setSeason(pre.season);
        if (Array.isArray(pre.interests) && pre.interests.length)
          setInterests(pre.interests);
        localStorage.removeItem("raahi.plannerPrefill");
      }
    } catch {
      // ignore prefill errors
    }

    const fetchData = async () => {
      try {
        const [weatherRes, crowdRes, poisRes] = await Promise.all([
          getWeather(),
          getCrowd(),
          getPOIs(city),
        ]);
        setWeatherData(weatherRes.data);
        setCrowdData(crowdRes.data);
        setPoisData(poisRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [city]);

  const weather = useMemo(() => {
    if (!weatherData || weatherData.length === 0) return "Loading...";
    const cityWeather = weatherData.find(
      (w) => w.city?.toLowerCase() === city.toLowerCase()
    );
    return cityWeather
      ? `${cityWeather.condition} (${cityWeather.temperature}°C)`
      : "No live data for this city";
  }, [weatherData, city]);

  const crowd = useMemo(() => {
    if (!crowdData || crowdData.length === 0) return "Loading...";
    const placeCrowd = crowdData.find(
      (c) => c.place?.toLowerCase() === city.toLowerCase()
    );
    return placeCrowd ? placeCrowd.crowd_level : "No live data for this city";
  }, [crowdData, city]);

  const plan = useMemo(() => {
    // Simple heuristic-based plan combining POIs + interests and daily budget pacing
    const pois = poisData;
    const dailyBudget = Math.round(budget / days);
    const suggested = Array.from({ length: days }, (_, d) => ({
      day: d + 1,
      morning: pois[d % pois.length]?.name || "Local exploration",
      afternoon:
        (interests.includes("Food & cafes")
          ? "Food walk"
          : pois[(d + 1) % pois.length]?.name) || "Museum/Cultural spot",
      evening: interests.includes("Shopping")
        ? "Bazaar & handicrafts"
        : "Sunset point / Promenade",
      budgetTip:
        dailyBudget < 2500
          ? "Try local eateries & metros"
          : "Mix taxis with metros; pre-book tickets",
    }));
    return { dailyBudget, items: suggested };
  }, [budget, days, interests, poisData]);

  const toggleInterest = (i) =>
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  // composePrompt removed in server-side AI path

  const formatPlan = (plan) => {
    if (!plan) return "";
    const lines = [];
    if (plan.summary) lines.push(`Summary: ${plan.summary}`);
    if (Array.isArray(plan.hotels) && plan.hotels.length) {
      lines.push("\nSuggested Hotels:");
      plan.hotels.forEach((h) =>
        lines.push(`- ${h.name} — ₹${h.price}/night, ${h.location}`)
      );
    }
    if (Array.isArray(plan.days)) {
      plan.days.forEach((d) => {
        lines.push(`\nDay ${d.day}:`);
        lines.push(`  Morning: ${d.morning}`);
        lines.push(`  Afternoon: ${d.afternoon}`);
        lines.push(`  Evening: ${d.evening}`);
        if (d.transport) lines.push(`  Transport: ${d.transport}`);
        if (Array.isArray(d.tips) && d.tips.length)
          lines.push(`  Tips: ${d.tips.join("; ")}`);
      });
    }
    if (Array.isArray(plan.warnings) && plan.warnings.length) {
      lines.push("\nWarnings:");
      plan.warnings.forEach((w) => lines.push(`- ${w}`));
    }
    return lines.join("\n");
  };

  const requestServerAI = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const payload = {
        city,
        startDate: new Date().toISOString().slice(0, 10),
        days,
        travelers: 2,
        interests,
        budget,
        constraints: [],
        season,
      };
      const { data } = await postAIPlan(payload);
      setAiOutput(formatPlan(data));
    } catch (err) {
      console.error("AI plan error", err);
      setAiError("Failed to generate plan. Please try again.");
      showError("Failed to generate AI plan. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const saveTrip = () => {
    const STORAGE_KEY = "raahi.trips";
    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      city,
      budget,
      days,
      season,
      interests,
      weather,
      crowd,
      savedAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(list) ? [record, ...list] : [record];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      showSuccess("Trip saved to Trips", "Saved");
    } catch {
      showError("Failed to save trip");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            AI-Powered Smart Travel Planner
          </h1>
          <p className="text-slate-600">
            Personalised itineraries for India — tuned to your budget, season,
            and interests. Live tips on weather, transport, and crowd levels.
          </p>
        </header>
        <section className="grid md:grid-cols-[340px_1fr] gap-6">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
            <form className="space-y-4" aria-labelledby="trip-setup-heading">
              <h2 id="trip-setup-heading" className="text-base font-semibold">
                Trip setup
              </h2>
              <div>
                <label
                  htmlFor="city-select"
                  className="block text-sm font-semibold mb-1"
                >
                  City
                </label>
                <select
                  id="city-select"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="select-control w-full"
                >
                  {[
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
              </div>
              <div>
                <label
                  htmlFor="budget-input"
                  className="block text-sm font-semibold mb-1"
                >
                  Budget (₹ total)
                </label>
                <input
                  id="budget-input"
                  name="budget"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg h-10 px-3"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Daily approx: ₹{plan.dailyBudget}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="days-input"
                    className="block text-sm font-semibold mb-1"
                  >
                    Days
                  </label>
                  <input
                    id="days-input"
                    name="days"
                    type="number"
                    min={1}
                    max={10}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg h-10 px-3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="season-select"
                    className="block text-sm font-semibold mb-1"
                  >
                    Season
                  </label>
                  <select
                    id="season-select"
                    name="season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="select-control w-full"
                  >
                    {["Winter", "Summer", "Monsoon"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold mb-2">
                  Interests
                </legend>
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((i) => {
                    const selected = interests.includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        aria-pressed={selected}
                        onClick={() => toggleInterest(i)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            toggleInterest(i);
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40 ${
                          selected
                            ? "bg-[var(--brand)]/10 border-[var(--brand)] text-[var(--brand)]"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </form>

            <div
              className="rounded-xl bg-[var(--brand)]/5 border border-[var(--brand)]/30 p-3 text-sm"
              role="status"
              aria-live="polite"
            >
              <div>
                <span className="font-semibold">Weather:</span> {weather}
              </div>
              <div>
                <span className="font-semibold">Crowd:</span> {crowd}
              </div>
              <div>
                <span className="font-semibold">Transport tip:</span>{" "}
                {city === "Delhi"
                  ? "Use Metro for faster cross-city travel"
                  : city === "Goa"
                  ? "Rent a scooter for short hops"
                  : "Pre-book cabs for longer hops"}
              </div>
            </div>
          </aside>
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">
                    Your heuristic plan
                  </div>
                  <div className="text-sm text-slate-600">
                    Baseline plan generated locally without AI
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={requestServerAI}
                    className="h-11 px-4 rounded-xl bg-[var(--brand)] text-white"
                    disabled={aiLoading}
                    aria-busy={aiLoading}
                    aria-describedby="ai-status"
                  >
                    {aiLoading ? "Generating…" : "Ask AI to refine plan"}
                  </button>
                  <button
                    type="button"
                    onClick={saveTrip}
                    className="h-11 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
                    title="Save current plan to Trips"
                  >
                    Save to Trips
                  </button>
                </div>
              </div>
            </div>
            {plan.items.map((d) => (
              <div
                key={d.day}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Day {d.day}</h2>
                  <div className="text-sm text-slate-600">
                    Budget tip: {d.budgetTip}
                  </div>
                </div>
                <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="font-semibold">Morning</div>
                    <div>{d.morning}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="font-semibold">Afternoon</div>
                    <div>{d.afternoon}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="font-semibold">Evening</div>
                    <div>{d.evening}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-0 shadow-card overflow-hidden">
                {/* Preserving layout: keep AI panel placeholder without in-browser model */}
                <div className="p-4 border-b border-slate-100">
                  <div className="text-lg font-semibold">AI Assistant</div>
                  <div className="text-xs text-slate-500">
                    Server-side AI plans when available. No WebGPU required.
                  </div>
                  {aiError && (
                    <div className="mt-2 text-xs text-red-600" role="alert">
                      {aiError}
                    </div>
                  )}
                </div>
                <div
                  id="ai-status"
                  className="p-4 text-sm text-slate-700"
                  role="status"
                  aria-live="polite"
                >
                  {aiLoading
                    ? "Contacting AI…"
                    : "Click the button to generate a tailored itinerary."}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="text-lg font-semibold mb-2">
                  AI itinerary (experimental)
                </div>
                <div className="text-sm text-slate-500 mb-3">
                  Powered by server-side AI (if configured). Falls back to a
                  local heuristic plan.
                </div>
                <div className="prose prose-slate max-w-none">
                  <pre
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    aria-live="polite"
                  >
                    {aiOutput ||
                      'Click "Ask AI to refine plan" above to generate a tailored itinerary.'}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
