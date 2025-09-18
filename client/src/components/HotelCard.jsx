import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        <div className="relative h-56 md:h-48">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Raahi Select
          </div>
        </div>
        <div className="p-4 md:p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <Link
                to={`/hotel/${hotel.id}`}
                className="text-lg md:text-xl font-bold hover:text-[var(--brand)]"
              >
                {hotel.name}
              </Link>
              <div className="text-slate-600 text-sm">{hotel.location}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700 mt-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">
                  {hotel.rating}★
                </span>
                <span>({hotel.reviews} Ratings)</span>
                <span>• {hotel.badge}</span>
              </div>
            </div>
            <div className="text-xs text-red-500">🔥 {hotel.socialProof}</div>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
            {hotel.amenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-2">
                • {a}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-2xl font-extrabold">
                ₹{hotel.price}
                <span className="ml-2 text-slate-400 line-through text-base font-medium">
                  ₹{hotel.originalPrice}
                </span>
                <span className="ml-2 text-green-600 text-sm font-bold">
                  {hotel.discount}% off
                </span>
              </div>
              <div className="text-xs text-slate-500">
                + taxes & fees · per room per night
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/hotel/${hotel.id}`}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                View Details
              </Link>
              <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
