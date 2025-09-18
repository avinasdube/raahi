import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const rates = { INR: 1, USD: 0.012, EUR: 0.011 }; // mock fx

export default function Budget() {
  const [home, setHome] = useState("INR");
  const [budget, setBudget] = useState(30000);
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("raahi.expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("raahi.expenses", JSON.stringify(items));
  }, [items]);

  const totalINR = useMemo(
    () => items.reduce((sum, it) => sum + (it.amountINR || 0), 0),
    [items]
  );
  const totalHome = useMemo(
    () => Math.round(totalINR * (rates[home] || 1) * 100) / 100,
    [totalINR, home]
  );
  const nearing = totalINR > budget * 0.8;

  const add = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const desc = String(form.get("desc"));
    const amt = Number(form.get("amt"));
    const cur = String(form.get("cur"));
    const inINR = Math.round((amt / (rates[cur] || 1)) * 100) / 100;
    setItems((prev) => [...prev, { id: Date.now(), desc, amountINR: inINR }]);
    e.currentTarget.reset();
  };

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Dynamic Currency & Budget Tracker
          </h1>
          <p className="text-slate-600">
            Track your trip expenses in your home currency with real-time
            conversion (mock) and get budget alerts.
          </p>
        </header>
        <section className="grid md:grid-cols-[360px_1fr] gap-6">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Home Currency
              </label>
              <select
                value={home}
                onChange={(e) => setHome(e.target.value)}
                className="w-full border border-slate-300 rounded-lg h-10 px-3"
              >
                {Object.keys(rates).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Total Trip Budget (₹)
              </label>
              <input
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                type="number"
                className="w-full border border-slate-300 rounded-lg h-10 px-3"
              />
            </div>
            <div
              className={`rounded-xl p-3 text-sm ${
                nearing
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-[var(--brand)]/5 border border-[var(--brand)]/30"
              }`}
            >
              <div>
                Spent: ₹{totalINR} ({totalHome} {home})
              </div>
              <div>Remaining: ₹{Math.max(0, budget - totalINR)}</div>
              {nearing && (
                <div className="text-amber-700 mt-1">
                  You are nearing your budget limit.
                </div>
              )}
            </div>
          </aside>
          <section className="space-y-4">
            <form
              onSubmit={add}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card grid md:grid-cols-[1fr_160px_120px_120px] gap-3 items-center"
            >
              <input
                name="desc"
                placeholder="Expense description (e.g., Metro fare, Lunch)"
                className="border border-slate-300 rounded-lg h-10 px-3"
              />
              <input
                name="amt"
                type="number"
                step="0.01"
                placeholder="Amount"
                className="border border-slate-300 rounded-lg h-10 px-3"
              />
              <select
                name="cur"
                className="border border-slate-300 rounded-lg h-10 px-3"
              >
                {Object.keys(rates).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button className="btn btn-primary">Add</button>
            </form>
            <div className="grid gap-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-card flex items-center justify-between text-sm"
                >
                  <div>{it.desc}</div>
                  <div>₹{it.amountINR}</div>
                </div>
              ))}
              {!items.length && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card text-sm text-slate-600">
                  No expenses yet. Add your first expense above.
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
