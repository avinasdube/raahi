import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Field = ({ label, children }) => (
  <div className="flex-1 min-w-[180px] px-4 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
    <div className="text-[10px] md:text-xs uppercase tracking-wide text-slate-500 font-semibold whitespace-nowrap">
      {label}
    </div>
    <div className="flex-1 flex items-center h-full">{children}</div>
  </div>
);

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  const [dates, setDates] = useState("Thu, 18 Sep – Fri, 19 Sep");
  const [guests, setGuests] = useState("1 Room, 1 Guest");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ q, dates, guests });
    // simple parse for rooms/guests "X Room, Y Guest"
    const [roomsStr, guestsStr] = guests.split(",").map((s) => s.trim());
    const rooms = parseInt(roomsStr) || 1;
    const guestCount = parseInt(guestsStr) || 1;
    const params = new URLSearchParams({
      q,
      dates,
      rooms: String(rooms),
      guests: String(guestCount),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="relative z-10">
      <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2 bg-white rounded-2xl border border-slate-200 p-3 md:p-2 shadow-card">
        <Field label="Location">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by city, hotel, or neighborhood"
            className="w-full outline-none text-sm md:text-base h-full"
          />
        </Field>
        <Field label="Dates">
          <input
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            className="w-full outline-none text-sm md:text-base h-full"
          />
        </Field>
        <Field label="Guests">
          <input
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full outline-none text-sm md:text-base h-full"
          />
        </Field>
        <button
          className="btn btn-primary text-white md:px-8 h-12"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
