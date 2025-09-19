import { useEffect, useMemo, useState } from "react";
import { getCrowd, getWeather } from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { showError, showSuccess, showWarning } from "../utils/toast";

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
  const [city, setCity] = useState("Jaipur");
  const [alert, setAlert] = useState(null);
  const [weather, setWeather] = useState([]);
  const [crowd, setCrowd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [severity, setSeverity] = useState("none");

  const list = helplines[lang];

  const reload = async () => {
    try {
      setLoading(true);
      const [wRes, cRes] = await Promise.all([getWeather(), getCrowd()]);
      setWeather(Array.isArray(wRes.data) ? wRes.data : []);
      setCrowd(Array.isArray(cRes.data) ? cRes.data : []);
      setLastUpdated(new Date());
      showSuccess(
        lang === "EN" ? "Safety data refreshed" : "सुरक्षा डेटा ताज़ा किया गया"
      );
    } catch {
      showError(
        lang === "EN"
          ? "Failed to load safety data"
          : "सुरक्षा डेटा लोड करने में विफल"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cityWeather = useMemo(() => {
    return weather.find((w) => w.city?.toLowerCase() === city.toLowerCase());
  }, [weather, city]);

  const cityCrowd = useMemo(() => {
    return crowd.find((c) => c.place?.toLowerCase() === city.toLowerCase());
  }, [crowd, city]);

  useEffect(() => {
    if (!cityWeather && !cityCrowd) return setAlert(null);
    const msgs = [];
    let score = 0;
    if (cityWeather) {
      const t = Number(cityWeather.temperature);
      const cond = String(cityWeather.condition || "");
      if (/rain|storm|thunder/i.test(cond)) {
        msgs.push(
          lang === "EN"
            ? "Weather alert: Rain expected—carry umbrella and avoid flooded areas."
            : "मौसम अलर्ट: बारिश की संभावना—छाता रखें और जलभराव से बचें।"
        );
        score += 2;
      }
      if (Number.isFinite(t) && (t >= 40 || t <= 5)) {
        msgs.push(
          lang === "EN"
            ? `Temperature advisory: ${t}°C. Stay hydrated and avoid peak afternoon sun.`
            : `तापमान सलाह: ${t}°C. हाइड्रेटेड रहें और दोपहर की धूप से बचें।`
        );
        score += 1;
      }
    }
    if (cityCrowd) {
      const lvl = String(cityCrowd.crowd_level || "");
      if (/high|very high|peak/i.test(lvl)) {
        msgs.push(
          lang === "EN"
            ? "Crowd advisory: Peak footfall—secure belongings, choose verified transport."
            : "भीड़ सलाह: अधिक भीड़—अपनी वस्तुओं का ध्यान रखें और प्रमाणित परिवहन चुनें।"
        );
        score += 1;
      }
    }
    setAlert(msgs.length ? msgs.join(" \u2022 ") : null);
    setSeverity(
      score >= 3
        ? "high"
        : score === 2
        ? "medium"
        : score === 1
        ? "low"
        : "none"
    );
  }, [cityWeather, cityCrowd, lang]);

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
            <div className="flex gap-2">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="select-control"
                aria-label={lang === "EN" ? "Select city" : "शहर चुनें"}
              >
                {["Jaipur", "Delhi", "Goa", "Mumbai", "Udaipur", "Manali"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  )
                )}
              </select>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="select-control"
              >
                <option value="EN">English</option>
                <option value="HI">हिन्दी</option>
              </select>
              <button
                onClick={reload}
                disabled={loading}
                className="h-10 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                title={lang === "EN" ? "Refresh data" : "डेटा रीफ़्रेश करें"}
              >
                {lang === "EN" ? "Refresh" : "रीफ़्रेश"}
              </button>
            </div>
          </div>
          <p className="text-slate-600">
            Quick access to helplines, nearest facilities, and live safety
            advisories based on weather and crowd data.
          </p>
          {lastUpdated && (
            <div className="mt-1 text-xs text-slate-500">
              {lang === "EN" ? "Last updated" : "अंतिम अद्यतन"}:{" "}
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
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
            <h2 className="text-xl font-bold">Nearest Facilities</h2>
            <p className="text-sm text-slate-600">
              {lang === "EN"
                ? "Open maps to find verified facilities near your current location."
                : "अपने वर्तमान स्थान के पास सत्यापित सुविधाएँ खोजने के लिए मैप खोलें।"}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {[
                { labelEN: "Hospitals", labelHI: "अस्पताल", q: "hospital" },
                { labelEN: "Police Stations", labelHI: "थाने", q: "police" },
                { labelEN: "Pharmacies", labelHI: "दवा दुकान", q: "pharmacy" },
              ].map((f) => (
                <button
                  key={f.q}
                  className="btn btn-outline justify-between"
                  onClick={async () => {
                    try {
                      const getPos = () =>
                        new Promise((res, rej) => {
                          if (!navigator.geolocation)
                            return rej(new Error("geo"));
                          navigator.geolocation.getCurrentPosition(
                            (p) => res(p.coords),
                            (e) => rej(e),
                            { enableHighAccuracy: true, timeout: 5000 }
                          );
                        });
                      let url = "";
                      try {
                        const coords = await getPos();
                        url = `https://www.google.com/maps/search/${encodeURIComponent(
                          f.q
                        )}/@${coords.latitude},${coords.longitude},14z`;
                      } catch {
                        url = `https://www.google.com/maps/search/${encodeURIComponent(
                          f.q + " near " + city
                        )}`;
                      }
                      window.open(url, "_blank", "noreferrer");
                      showSuccess(
                        lang === "EN"
                          ? "Opening Maps for nearby facilities"
                          : "नज़दीकी सुविधाओं के लिए मैप खुल रहा है"
                      );
                    } catch {
                      showError(
                        lang === "EN"
                          ? "Unable to open Maps"
                          : "मैप नहीं खुल सका"
                      );
                    }
                  }}
                >
                  <span>{lang === "EN" ? f.labelEN : f.labelHI}</span>
                  <span>↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {lang === "EN" ? "Alerts & Panic" : "अलर्ट और पैनिक"}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  severity === "high"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : severity === "medium"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : severity === "low"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
                aria-label="advisory severity"
              >
                {severity === "high"
                  ? lang === "EN"
                    ? "High Risk"
                    : "उच्च जोखिम"
                  : severity === "medium"
                  ? lang === "EN"
                    ? "Moderate"
                    : "मध्यम"
                  : severity === "low"
                  ? lang === "EN"
                    ? "Low"
                    : "न्यून"
                  : lang === "EN"
                  ? "Normal"
                  : "सामान्य"}
              </span>
            </div>
            <div className="text-sm text-slate-600 min-h-[40px]">
              {loading
                ? lang === "EN"
                  ? "Loading advisories…"
                  : "सलाह लोड हो रही है…"
                : alert ||
                  (lang === "EN"
                    ? "No active alerts"
                    : "कोई सक्रिय अलर्ट नहीं")}
            </div>
            <button
              className="mt-4 btn btn-primary w-full"
              onClick={async () => {
                try {
                  window.location.href = "tel:112";
                  const canShare = navigator.share && navigator.geolocation;
                  if (canShare) {
                    const pos = await new Promise((res, rej) =>
                      navigator.geolocation.getCurrentPosition(
                        (p) => res(p.coords),
                        (e) => rej(e),
                        { enableHighAccuracy: true, timeout: 4000 }
                      )
                    );
                    const maps = `https://maps.google.com/?q=${pos.latitude},${pos.longitude}`;
                    await navigator.share({
                      title: "Emergency Location",
                      text:
                        lang === "EN"
                          ? `I need help. Location: ${pos.latitude}, ${pos.longitude}`
                          : `मदद की आवश्यकता है। स्थान: ${pos.latitude}, ${pos.longitude}`,
                      url: maps,
                    });
                    showSuccess(
                      lang === "EN"
                        ? "Shared your location with selected contact"
                        : "आपका स्थान साझा किया गया"
                    );
                  } else {
                    const coords = await new Promise((res) =>
                      navigator.geolocation?.getCurrentPosition(
                        (p) => res(p.coords),
                        () => res(null)
                      )
                    );
                    if (coords) {
                      const text = `${coords.latitude}, ${coords.longitude}`;
                      await navigator.clipboard?.writeText(text);
                      showWarning(
                        lang === "EN"
                          ? "Location copied to clipboard"
                          : "लोकेशन क्लिपबोर्ड पर कॉपी हुआ"
                      );
                    } else {
                      showWarning(
                        lang === "EN"
                          ? "Could not get location. Dialing emergency."
                          : "स्थान प्राप्त नहीं हुआ। आपातकालीन कॉल की जा रही है।"
                      );
                    }
                  }
                } catch {
                  showError(
                    lang === "EN"
                      ? "Panic action failed. Try calling 112."
                      : "पैनिक कार्रवाई विफल। 112 पर कॉल करें।"
                  );
                }
              }}
            >
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
