import { Link } from "react-router-dom";
import hawamahal from "../assets/hawamahal.jpg";
import Footer from "../components/Footer";
import MapView from "../components/MapView";
import Navbar from "../components/Navbar";
import Reveal from "../components/Reveal";
import SearchBar from "../components/SearchBar";

const Stat = ({ num, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-extrabold">{num}</div>
    <div className="text-slate-500">{label}</div>
  </div>
);

const Home = () => (
  <>
    <Navbar />
    {/* Hero with full-bleed background image under transparent navbar */}
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end">
      {/* Hawa Mahal, Jaipur - local asset for fast loads and consistency */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${hawamahal})` }}
      />
      <div className="absolute inset-0 -z-10 bg-black/50 md:bg-black/40" />
      <div className="container pb-10 pt-28 md:pt-36 text-left text-white">
        <Reveal>
          <h1 className="max-w-3xl text-3xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow">
            Over 174,000 hotels and homes across 35+ countries
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-2 max-w-2xl text-white/90">
            Find stays you love — from budget-friendly rooms to premium hotels —
            across India and beyond.
          </p>
        </Reveal>
      </div>
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0">
        <div className="container">
          <SearchBar />
        </div>
      </div>
    </section>

    {/* benefits strip */}
    <section className="bg-white/70 backdrop-blur">
      <div className="container -mt-6 md:-mt-8 relative z-10">
        <div className="grid sm:grid-cols-3 gap-3 md:gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-card">
          {[
            {
              title: "Best prices guaranteed",
              desc: "Exclusive app-only deals",
            },
            { title: "24x7 support", desc: "We’re here whenever you need" },
            { title: "Verified stays", desc: "Trusted reviews and amenities" },
          ].map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 120}
              className="flex items-start gap-3"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                ★
              </span>
              <div>
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-slate-600">{b.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="pt-16 md:pt-20 bg-gradient-to-b from-white to-[var(--bg)] pb-10">
      <div className="container grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        <Reveal className="rounded-3xl bg-white border border-slate-200 p-6 shadow-card">
          <h2 className="text-2xl font-bold mb-3">
            There's an OYO around. Always.
          </h2>
          <p className="text-slate-600 mb-5">
            More Destinations. More Ease. More Affordable.
          </p>
          <div className="grid grid-cols-2 gap-6 md:gap-10">
            <Stat num="35+" label="Countries" />
            <Stat num="174,000+" label="Hotels & Homes" />
          </div>
        </Reveal>
        <Reveal
          delay={120}
          className="rounded-3xl bg-white border border-slate-200 p-4 shadow-card"
        >
          <div className="h-72 md:h-80 rounded-2xl bg-[url('https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </Reveal>
      </div>
      <div className="container mt-6 md:mt-8">
        <Reveal>
          <MapView />
        </Reveal>
      </div>
    </section>

    {/* featured destinations */}
    <section className="bg-white py-10 md:py-12">
      <div className="container">
        <Reveal className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Featured destinations
            </h2>
            <p className="text-slate-600">
              Explore popular cities across India
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              city: "Jaipur",
              img: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200&auto=format&fit=crop",
            },
            {
              city: "Delhi",
              img: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=1200&auto=format&fit=crop",
            },
            {
              city: "Goa",
              img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
            },
            {
              city: "Udaipur",
              img: "https://images.unsplash.com/photo-1585863505434-5a78f1d10af6?q=80&w=1200&auto=format&fit=crop",
            },
            {
              city: "Mumbai",
              img: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
            },
            {
              city: "Manali",
              img: "https://images.unsplash.com/photo-1542190891-2093d38760f2?q=80&w=1200&auto=format&fit=crop",
            },
          ].map((d, i) => (
            <Reveal
              key={d.city}
              delay={i * 100}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-card"
            >
              <Link
                to={`/search?q=${encodeURIComponent(d.city)}`}
                className="block"
              >
                <img
                  src={d.img}
                  alt={d.city}
                  className="h-44 md:h-56 w-full object-cover group-hover:scale-[1.02] transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white font-semibold text-lg drop-shadow">
                  {d.city}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* testimonials */}
    <section className="bg-[var(--bg)] py-10 md:py-12">
      <div className="container">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
            What guests say
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              quote: "Clean rooms, great locations, and super easy check-in.",
              name: "Anita, Delhi",
            },
            {
              quote: "Affordable stays without compromising comfort.",
              name: "Rahul, Mumbai",
            },
            {
              quote: "Found last-minute rooms at amazing prices!",
              name: "Priya, Jaipur",
            },
          ].map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 120}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-card"
            >
              <div className="text-[var(--brand)] mb-2">★★★★★</div>
              <p className="text-slate-700">{t.quote}</p>
              <div className="mt-3 text-sm text-slate-500">{t.name}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-10 md:py-12">
      <div className="container">
        <Reveal className="rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold">
              Get access to exclusive deals
            </h3>
            <p className="text-slate-600">
              Only the best deals reach your inbox
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="e.g., john@email.com"
              className="flex-1 md:w-96 h-12 rounded-xl border border-slate-300 px-4"
            />
            <button type="button" className="btn btn-primary h-12 px-6">
              Notify me
            </button>
          </form>
        </Reveal>
      </div>
    </section>
    <Footer />
  </>
);

export default Home;
