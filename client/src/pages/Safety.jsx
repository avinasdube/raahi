import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const helplines = {
  EN: [
    { name: "Emergency (All-India)", value: "112" },
    { name: "Ambulance", value: "108" },
    { name: "Police", value: "100" },
    { name: "Women Helpline", value: "1091" },
  ],
  HI: [
    { name: "आपातकालीन (सर्वभारत)", value: "112" },
    { name: "एम्बुलेंस", value: "108" },
    { name: "पुलिस", value: "100" },
    { name: "महिला हेल्पलाइन", value: "1091" },
  ],
};

export default function Safety() {
  const [lang, setLang] = useState("EN");
  const [alert, setAlert] = useState(null);

  const list = helplines[lang];
  const safetyTips = useMemo(
    () => [
      lang === "EN"
        ? "Share live location with a trusted contact"
        : "विश्वसनीय संपर्क के साथ लोकेशन साझा करें",
      lang === "EN"
        ? "Use verified taxis and keep emergency numbers handy"
        : "वेरिफ़ाइड टैक्सी का उपयोग करें और हेल्पलाइन सेव करें",
      lang === "EN"
        ? "Avoid isolated areas late at night"
        : "रात में सुनसान क्षेत्रों से बचें",
    ],
    [lang]
  );

  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Tourist Safety & Assistance
            </h1>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border border-slate-300 rounded-lg h-10 px-3"
            >
              <option value="EN">English</option>
              <option value="HI">हिन्दी</option>
            </select>
          </div>
          <p className="text-slate-600">
            Quick access to helplines, nearest facilities (mock), and real-time
            safety alerts. India-first emergency support.
          </p>
        </header>
        <section className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold">Helplines</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {list.map((h) => (
                <li
                  key={h.name}
                  className="flex items-center justify-between border-b border-slate-100 pb-2"
                >
                  <span>{h.name}</span>
                  <a
                    className="text-[var(--brand)] font-semibold"
                    href={`tel:${h.value}`}
                  >
                    {h.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold">Nearest Facilities (Mock)</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Hospital: City Care, 1.2 km</li>
              <li>Police Station: Central Police, 0.8 km</li>
              <li>Pharmacy: HealthPlus, 0.4 km</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold">Alerts & Panic</h2>
            <div className="text-sm text-slate-600">
              {alert ||
                (lang === "EN" ? "No active alerts" : "कोई सक्रिय अलर्ट नहीं")}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-outline"
                onClick={() =>
                  setAlert(
                    lang === "EN"
                      ? "Heavy rain advisory in your area"
                      : "आपके क्षेत्र में भारी बारिश की चेतावनी"
                  )
                }
              >
                Simulate Weather Alert
              </button>
              <button
                className="btn btn-outline"
                onClick={() =>
                  setAlert(
                    lang === "EN"
                      ? "Traffic congestion near city center"
                      : "सिटी सेंटर के पास ट्रैफिक"
                  )
                }
              >
                Simulate Traffic Alert
              </button>
            </div>
            <button className="mt-4 btn btn-primary w-full">
              {lang === "EN" ? "PANIC BUTTON" : "पैनिक बटन"}
            </button>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-xl font-bold mb-2">Safety Tips</h2>
          <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
            {safetyTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
