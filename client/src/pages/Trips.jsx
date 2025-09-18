import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Trips() {
  const trips = [];
  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Your Trips</h1>
            <p className="text-slate-600">
              Manage upcoming bookings and view past stays.
            </p>
          </div>
          <button className="btn btn-primary">Plan a new trip</button>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-card">
            <img
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
              alt="Plan your next trip"
              className="w-28 h-28 object-cover rounded-xl mx-auto mb-3"
              loading="lazy"
            />
            <h2 className="text-xl font-bold mb-1">No trips yet</h2>
            <p className="text-slate-600 mb-4">
              Sign in to sync your saved stays and bookings across devices.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="btn-outline">Sign in</button>
              <button className="btn btn-primary">Start exploring</button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trip cards would render here */}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
