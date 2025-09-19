export default function FiltersSidebar({
  selectedPopular = [],
  onTogglePopular,
  priceMax = 4000,
  onPriceChange,
  selectedCollections = [],
  onToggleCollection,
  onClear,
}) {
  const collections = [
    "Family stays",
    "Your friendly neighbourhood stay",
    "For group travellers",
    "Near airport",
    "Local IDs accepted",
  ];
  // Align with current dataset's cities so filters are effective
  const popular = ["Jaipur", "Agra", "Varanasi", "Goa", "Manali"];
  return (
    <aside className="w-full md:w-80 shrink-0 border-r border-slate-200 pr-4 md:pr-6 sticky top-24 self-start">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Filters</h2>
        {onClear && (
          <button
            onClick={onClear}
            className="text-sm text-[var(--brand)] hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <div className="mb-6">
        <div className="text-sm font-semibold text-slate-700 mb-2">
          Popular locations
        </div>
        <div className="flex flex-wrap gap-2">
          {popular.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onTogglePopular?.(p)}
              aria-pressed={selectedPopular.includes(p)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                selectedPopular.includes(p)
                  ? "bg-[var(--brand)]/10 border-[var(--brand)] text-[var(--brand)]"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm font-semibold text-slate-700 mb-2">Price</div>
        <input
          type="range"
          min="400"
          max="4000"
          value={priceMax}
          onChange={(e) => onPriceChange?.(Number(e.target.value))}
          className="w-full accent-[var(--brand)]"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>₹420</span>
          <span>₹{priceMax}</span>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-700 mb-2">
          Collections
        </div>
        <ul className="space-y-2">
          {collections.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCollections.includes(c)}
                onChange={() => onToggleCollection?.(c)}
                className="accent-[var(--brand)]"
              />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
