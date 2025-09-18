import { Link, useNavigate } from "react-router-dom";
import agraImg from "../assets/Agra India.JPG";
import goa from "../assets/goa.jpg";
import hawamahal from "../assets/hawamahal.jpg";
import manali from "../assets/manalii.jpg";
import varanasi from "../assets/varanasi.jpg";
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

const SectionHeading = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
      {subtitle && <p className="text-slate-600">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const quickCities = ["Jaipur", "Delhi", "Goa", "Mumbai", "Varanasi", "Agra"];

  const goExplore = (tab) => navigate(`/explore?tab=${tab}`);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert(`Thank you for subscribing! We'll send deals to ${email}.`);
      e.target.reset();
    }
  };

  return (
    <>
      <Navbar />
      {/* Hero: full-bleed image, search, and quick chips */}
      <div className="flex flex-col gap-y-4">
        <section className="relative min-h-[68vh] flex flex-col items-end">
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${hawamahal})` }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="container pt-28 md:pt-36 pb-10 text-white">
            <Reveal>
              00
              <h1 className="max-w-4xl text-3xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow">
                Plan, find, and book India-first stays and experiences
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-2 max-w-2xl text-white/90">
                Search verified stays, discover local experiences, and organize
                your trip with a smart planner.
              </p>
            </Reveal>
            <div className="mt-6 max-w-4xl">
              <Reveal>
                <SearchBar onSearch={() => {}} />
              </Reveal>
            </div>
            <Reveal delay={180}>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickCities.map((c) => (
                  <Link
                    key={c}
                    to={`/search?q=${encodeURIComponent(c)}`}
                    className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => goExplore("stays")}
                  className="btn btn-primary px-5 py-2"
                >
                  Explore Stays
                </button>
                <button
                  onClick={() => goExplore("market")}
                  className="btn bg-white/10 text-white border border-white/20 px-5 py-2 rounded-xl"
                >
                  Explore Marketplace
                </button>
                <Link
                  to="/planner"
                  className="btn bg-white/10 text-white border border-white/20 px-5 py-2 rounded-xl"
                >
                  Open Planner
                </Link>
              </div>
            </Reveal>
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
                {
                  title: "Verified stays",
                  desc: "Trusted reviews and amenities",
                },
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

        {/* Explore split cards */}
        <section className="bg-gradient-to-b from-white to-[var(--bg)] py-10 md:py-14">
          <div className="container">
            <Reveal>
              <SectionHeading
                title="Explore"
                subtitle="Find the right place and plan your trip"
              />
            </Reveal>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Reveal className="group relative rounded-3xl overflow-hidden border border-slate-200 shadow-card">
                <button
                  onClick={() => goExplore("stays")}
                  className="block w-full text-left"
                >
                  <div
                    className="h-52 md:h-64"
                    style={{ backgroundImage: `url(${agraImg})` }}
                  />
                  <div className="p-5">
                    <div className="text-xl font-bold">Stays</div>
                    <div className="text-slate-600">
                      Affordable rooms and boutique hotels
                    </div>
                  </div>
                </button>
              </Reveal>
              <Reveal
                delay={120}
                className="group relative rounded-3xl overflow-hidden border border-slate-200 shadow-card"
              >
                <button
                  onClick={() => goExplore("market")}
                  className="block w-full text-left"
                >
                  <div
                    className="h-52 md:h-64"
                    style={{ backgroundImage: `url(${manali})` }}
                  />
                  <div className="p-5">
                    <div className="text-xl font-bold">Marketplace</div>
                    <div className="text-slate-600">
                      Guides, experiences, homestays, and shops
                    </div>
                  </div>
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Stats + map */}
        <section className="pt-2 md:pt-4 bg-[var(--bg)] pb-10">
          <div className="container mt-6 md:mt-8">
            <Reveal>
              <MapView />
            </Reveal>
          </div>
        </section>

        {/* Trending collections */}
        <section className="bg-white py-10 md:py-12">
          <div className="container">
            <Reveal>
              <SectionHeading
                title="Trending collections"
                subtitle="Pick a style that suits your trip"
              />
            </Reveal>
            <div className="flex flex-wrap gap-2">
              {[
                "Family friendly",
                "Near Airport",
                "Great for groups",
                "Local IDs accepted",
                "Pet friendly",
              ].map((c, i) => (
                <Reveal key={c} delay={i * 90}>
                  <Link
                    to={`/explore?tab=stays&collections=${encodeURIComponent(
                      c
                    )}`}
                    className="px-3 py-1.5 rounded-full border border-slate-300 bg-slate-50 hover:bg-white text-sm"
                  >
                    {c}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Featured destinations */}
        <section className="bg-white pt-0 pb-10 md:pb-12">
          <div className="container">
            <Reveal>
              <SectionHeading
                title="Featured destinations"
                subtitle="Explore popular cities across India"
                action={
                  <Link
                    to="/explore"
                    className="text-[var(--brand)] font-semibold"
                  >
                    View all
                  </Link>
                }
              />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  city: "Jaipur",
                  // use local asset to avoid broken remote links
                  img: hawamahal,
                },
                {
                  city: "Agra",
                  img: agraImg,
                },
                {
                  city: "Varanasi",
                  img: varanasi,
                },
                {
                  city: "Goa",
                  img: goa,
                },
                {
                  city: "Manali",
                  img: manali,
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
                  quote:
                    "Clean rooms, great locations, and super easy check-in.",
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
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex w-full md:w-auto gap-2"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="e.g., john@email.com"
                  className="flex-1 md:w-96 h-12 rounded-xl border border-slate-300 px-4"
                  required
                />
                <button type="submit" className="btn btn-primary h-12 px-6">
                  Notify me
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
