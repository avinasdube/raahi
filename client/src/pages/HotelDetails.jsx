import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { hotels } from "../data/hotels";

export default function HotelDetails() {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id) || hotels[0];
  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-10 grid lg:grid-cols-[1fr_360px] gap-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="col-span-2 h-60 md:h-80 w-full object-cover"
            />
            <img
              src={hotel.image}
              alt=""
              className="h-28 md:h-40 w-full object-cover"
            />
            <img
              src={hotel.image}
              alt=""
              className="h-28 md:h-40 w-full object-cover"
            />
            <img
              src={hotel.image}
              alt=""
              className="h-28 md:h-40 w-full object-cover hidden md:block"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold mt-4">
            {hotel.name}
          </h1>
          <p className="text-slate-600">{hotel.location}</p>

          <div className="mt-4">
            <h2 className="font-bold text-lg mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {hotel.amenities.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Location</h2>
            <div className="h-64 rounded-xl bg-slate-200 flex items-center justify-center">
              Map placeholder
            </div>
          </div>
        </section>

        <aside className="bg-white rounded-2xl border border-slate-200 p-4 h-max sticky top-24 shadow-card">
          <div className="text-3xl font-extrabold">₹{hotel.price}</div>
          <div className="text-sm text-slate-500">
            + taxes & fees · per room per night
          </div>
          <button className="btn btn-primary w-full mt-4">Book Now</button>
        </aside>
      </main>
      <Footer />
    </>
  );
}
