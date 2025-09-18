import { useMemo, useState } from "react";
import AIAssistant from "../components/AIAssistant";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const interestsList = [
  "Historical sites",
  "Beaches",
  "Mountains",
  "Food & cafes",
  "Shopping",
  "Wildlife & nature",
  "Festivals & culture",
];

const samplePOIs = {
  Jaipur: [
    { name: "Hawa Mahal", time: "9:00 AM", tip: "Best light in the morning." },
    {
      name: "City Palace",
      time: "11:00 AM",
      tip: "Combo ticket with Jantar Mantar.",
    },
    { name: "Amber Fort", time: "3:00 PM", tip: "Stay for sunset views." },
  ],
  Goa: [
    {
      name: "Baga Beach",
      time: "10:00 AM",
      tip: "Water sports open by mid-morning.",
    },
    {
      name: "Fort Aguada",
      time: "1:00 PM",
      tip: "Great sea views and photos.",
    },
    {
      name: "Candolim",
      time: "5:30 PM",
      tip: "Beach shacks for sunset snacks.",
    },
  ],
  Delhi: [
    {
      name: "India Gate",
      time: "9:30 AM",
      tip: "Walk the lawns if weather permits.",
    },
    {
      name: "Qutub Minar",
      time: "12:00 PM",
      tip: "Carry water; open courtyards.",
    },
    {
      name: "Humayun's Tomb",
      time: "3:30 PM",
      tip: "Beautiful Mughal gardens.",
    },
  ],
};

export default function Planner() {
  const [city, setCity] = useState("Jaipur");
  const [budget, setBudget] = useState(20000);
  const [days, setDays] = useState(3);
  const [season, setSeason] = useState("Winter");
  const [interests, setInterests] = useState(["Historical sites"]);
  const [aiPromptKey, setAiPromptKey] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const weather = useMemo(() => {
    // Mock weather by season
    const map = {
      Summer: "Hot (34–40°C)",
      Monsoon: "Humid with showers",
      Winter: "Pleasant (12–24°C)",
    };
    return map[season] || "Pleasant";
  }, [season]);

  const crowd = useMemo(() => {
    // Mock crowd density by season and city popularity
    const popular = ["Goa", "Jaipur", "Manali", "Mumbai"];
    const base = popular.includes(city) ? 3 : 2; // 1 low, 3 high
    const seasonal = season === "Winter" ? 3 : season === "Monsoon" ? 2 : 3;
    const level = Math.min(3, Math.max(1, Math.round((base + seasonal) / 2)));
    return ["Low", "Medium", "High"][level - 1];
  }, [city, season]);

  const plan = useMemo(() => {
    // Simple heuristic-based plan combining POIs + interests and daily budget pacing
    const pois = samplePOIs[city] || [];
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
  }, [city, budget, days, interests]);

  const toggleInterest = (i) =>
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const composePrompt = () => {
    const i = interests.length ? interests.join(", ") : "general sightseeing";
    return (
      `Plan a detailed, day-by-day itinerary for ${days} days in ${city} during ${season}. ` +
      `Total trip budget is ₹${budget}. Focus on: ${i}. ` +
      `Include morning/afternoon/evening suggestions, local transport tips, ` +
      `approx costs where helpful, and 2-3 dining ideas each day. Keep it crisp and practical. ` +
      `Use Indian context, timings, and cultural notes where relevant.`
    );
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
            <div>
              <label className="block text-sm font-semibold mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-slate-300 rounded-lg h-10 px-3"
              >
                {["Jaipur", "Delhi", "Goa", "Mumbai", "Udaipur", "Manali"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Budget (₹ total)
              </label>
              <input
                type="number"
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
                <label className="block text-sm font-semibold mb-1">Days</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg h-10 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg h-10 px-3"
                >
                  {["Winter", "Summer", "Monsoon"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Interests</div>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      interests.includes(i)
                        ? "bg-[var(--brand)]/10 border-[var(--brand)] text-[var(--brand)]"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--brand)]/5 border border-[var(--brand)]/30 p-3 text-sm">
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
                    onClick={() => {
                      const p = composePrompt();
                      setAiPrompt(p);
                      setAiPromptKey((k) => k + 1);
                    }}
                    className="h-11 px-4 rounded-xl bg-[var(--brand)] text-white"
                  >
                    Ask AI to refine plan
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
                <AIAssistant
                  prompt={aiPrompt}
                  autoSendKey={aiPromptKey}
                  onResponse={(txt) => setAiOutput(txt)}
                  prefill={composePrompt()}
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="text-lg font-semibold mb-2">
                  AI itinerary (experimental)
                </div>
                <div className="text-sm text-slate-500 mb-3">
                  Runs fully in your browser. First response may take time to
                  load and cache the model.
                </div>
                <div className="prose prose-slate max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
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
