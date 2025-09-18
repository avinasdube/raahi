import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Saved() {
  const items = [];
  return (
    <>
      <Navbar />
      <main className="container pt-24 md:pt-28 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Saved</h1>
            <p className="text-slate-600">
              Your wishlist of hotels and places.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm">
            <button className="btn-outline">Share</button>
            <button className="btn-outline">Manage</button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-card">
            <div className="text-5xl mb-2">💖</div>
            <h2 className="text-xl font-bold mb-1">Nothing saved yet</h2>
            <p className="text-slate-600 mb-4">
              Tap the heart on any hotel to add it to your list and plan later.
            </p>
            <button className="btn btn-primary">Discover stays</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Saved hotel cards would render here */}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
