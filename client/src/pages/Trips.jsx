import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const STORAGE_KEY = "raahi.trips";

export default function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  // Load trips from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setTrips(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load trips", e);
      setTrips([]);
    }
  }, []);

  const hasTrips = trips && trips.length > 0;

  const removeTrip = (id) => {
    const next = trips.filter((t) => t.id !== id);
    setTrips(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write errors
    }
  };

  const openInPlanner = (trip) => {
    try {
      localStorage.setItem(
        "raahi.plannerPrefill",
        JSON.stringify({
          city: trip.city,
          budget: trip.budget,
          days: trip.days,
          season: trip.season,
          interests: trip.interests || [],
        })
      );
    } catch {
      // ignore prefill write errors
    }
    navigate("/planner");
  };

  const planNew = () => navigate("/planner");

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Your Trips</h1>
            <p className="text-slate-600">
              Your saved plans and itineraries — all in one place.
            </p>
          </div>
          <button className="btn btn-primary" onClick={planNew}>
            Plan a new trip
          </button>
        </div>

        {!hasTrips ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-card">
            <img
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
              alt="Plan your next trip"
              className="w-28 h-28 object-cover rounded-xl mx-auto mb-3"
              loading="lazy"
            />
            <h2 className="text-xl font-bold mb-1">No trips yet</h2>
            <p className="text-slate-600 mb-4">
              Use the Planner to create an itinerary and save it to Trips.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="btn btn-primary" onClick={planNew}>
                Open Planner
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">{t.city}</div>
                    <div className="text-sm text-slate-600">
                      {t.days} days • ₹{t.budget} • {t.season}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Saved{" "}
                    {new Date(t.savedAt || t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {t.interests?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {t.interests.slice(0, 4).map((i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {i}
                      </span>
                    ))}
                    {t.interests.length > 4 && (
                      <span className="text-slate-500">
                        +{t.interests.length - 4} more
                      </span>
                    )}
                  </div>
                ) : null}
                {t.weather || t.crowd ? (
                  <div className="mt-2 text-xs text-slate-600">
                    {t.weather && <span>Weather: {t.weather}</span>}{" "}
                    {t.crowd && <span>• Crowd: {t.crowd}</span>}
                  </div>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => openInPlanner(t)}
                  >
                    Open in Planner
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => removeTrip(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
