import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden
  >
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.07a15.7 15.7 0 00-1.07-5.02A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.4 2.23 2.96 7H9.04C9.6 6.23 11.1 4 12 4zM8.21 3.98A15.7 15.7 0 007.14 9H4.07a8.02 8.02 0 014.14-5.02zM4.07 13h3.07c.24 1.78.66 3.5 1.14 5.02A8.02 8.02 0 014.07 13zM12 20c-.9 0-2.4-2.23-2.96-7h5.92C14.4 17.77 12.9 20 12 20zm3.79-.02A15.7 15.7 0 0016.86 15h3.07a8.02 8.02 0 01-4.14 4.98z" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-slate-200/70 shadow-sm"
          : "bg-white/60 backdrop-blur border-b border-slate-200/50"
      }`}
    >
      <nav className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Raahi
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[15px] font-semibold">
          {[
            { to: "/", label: "Home" },
            { to: "/hotels", label: "Hotels" },
            { to: "/trips", label: "Trips" },
            { to: "/saved", label: "Saved" },
            { to: "/planner", label: "Planner" },
            { to: "/marketplace", label: "Marketplace" },
            { to: "/safety", label: "Safety" },
            { to: "/budget", label: "Budget" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `hover:text-[var(--brand)] ${
                  isActive ? "text-[var(--brand)]" : "text-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="h-5 w-px bg-slate-200/70" />
          <Link
            to="/auth"
            className="btn-outline hidden lg:inline-flex text-slate-800"
          >
            Login / Signup
          </Link>
          <button
            className="inline-flex items-center gap-2 text-slate-800"
            aria-label="Language"
          >
            <GlobeIcon />
            <span className="hidden lg:inline">EN</span>
          </button>
        </div>

        <div className="md:hidden">
          <button className="btn btn-outline">Menu</button>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
