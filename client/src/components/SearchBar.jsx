import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Field = ({ label, children }) => (
  <div className="flex-1 min-w-[180px] px-4 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 focus-within:ring-2 focus-within:ring-orange-500/30 dark:focus-within:ring-orange-400/25 focus-within:border-orange-300 dark:focus-within:border-orange-400/30 transition-colors">
    <div className="text-[10px] md:text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
      {label}
    </div>
    <div className="flex-1 flex items-center h-full">{children}</div>
  </div>
);

export default function SearchBar({
  onSearch,
  valueQ,
  valueDates,
  valueGuests,
  onChangeQ,
  onChangeDates,
  onChangeGuests,
}) {
  const [q, setQ] = useState(valueQ ?? "");
  const [dates, setDates] = useState(valueDates ?? "");
  const [guests, setGuests] = useState(valueGuests ?? "1 Room, 1 Guest");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ q, dates, guests });
    // parse guests string like "X Room(s), Y Guest(s)"
    const parts = guests.split(",").map((s) => s.trim());
    const roomsMatch = parts[0]?.match(/\d+/);
    const guestsMatch = parts[1]?.match(/\d+/);
    const rooms = roomsMatch ? parseInt(roomsMatch[0], 10) : 1;
    const guestCount = guestsMatch ? parseInt(guestsMatch[0], 10) : 1;
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
      <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2 bg-gray-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 md:p-2 shadow-card">
        <Field label="Location">
          <input
            value={valueQ ?? q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              onChangeQ?.(v);
            }}
            placeholder="Search by city, hotel, or neighborhood"
            className="w-full outline-none text-sm md:text-base h-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            required
          />
        </Field>
        <Field label="Dates">
          <input
            value={valueDates ?? dates}
            onChange={(e) => {
              const v = e.target.value;
              setDates(v);
              onChangeDates?.(v);
            }}
            className="w-full outline-none text-sm md:text-base h-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Check-in – Check-out"
            required
          />
        </Field>
        <Field label="Guests">
          <input
            value={valueGuests ?? guests}
            onChange={(e) => {
              const v = e.target.value;
              setGuests(v);
              onChangeGuests?.(v);
            }}
            className="w-full outline-none text-sm md:text-base h-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            aria-label="Guests and rooms"
          />
        </Field>
        <button
          className="btn btn-primary text-white md:px-8 h-12 focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:outline-none"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
