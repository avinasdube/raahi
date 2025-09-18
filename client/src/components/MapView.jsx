import { useEffect, useRef } from "react";

// Lightweight interactive map using Leaflet via CDN (no package install needed)
// We load the stylesheet once and then create a map with tiles + markers.
export default function MapView() {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const ensureLeaflet = async () => {
      if (!document.querySelector("link[data-leaflet]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "1");
        document.head.appendChild(link);
      }
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
    };
    ensureLeaflet().then(() => {
      if (mapRef.current) return; // already initialized
      const L = window.L;
      mapRef.current = L.map(ref.current).setView([28.6139, 77.209], 11); // Delhi
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
      const spots = [
        { coords: [28.6448, 77.2167], label: "Connaught Place" },
        { coords: [28.6129, 77.2295], label: "India Gate" },
        { coords: [28.5245, 77.1855], label: "Qutub Minar" },
      ];
      spots.forEach((s) =>
        L.marker(s.coords).addTo(mapRef.current).bindPopup(s.label)
      );
    });
    return () => {
      try {
        mapRef.current?.remove();
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-card">
      <div className="p-5">
        <h3 className="text-xl font-extrabold">Explore stays on the map</h3>
        <p className="text-slate-600">
          Pan and zoom to discover top neighborhoods and popular landmarks in
          the city.
        </p>
      </div>
      <div ref={ref} className="h-[360px] w-full" />
    </div>
  );
}
