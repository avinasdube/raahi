import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

const HamburgerIcon = ({ isOpen }) => (
  <svg
    className="w-6 h-6 transition-transform duration-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {isOpen ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    )}
  </svg>
);

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize theme from document class (set early in index.html)
  useEffect(() => {
    const enabled = document.documentElement.classList.contains("dark");
    setDark(enabled);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("raahi-theme", dark ? "dark" : "light");
  }, [dark]);

  // Close mobile menu or account menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setAccountOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close account menu on outside click
  const accountRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!accountRef.current) return;
      if (!accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [accountOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-slate-200/70 shadow-sm"
          : "bg-white/60 backdrop-blur border-b border-slate-200/50"
      }`}
    >
      <nav className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center group">
          <span className="text-[26px] md:text-2xl font-extrabold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-[var(--brand)] relative">
            Raahi
            <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full transition-[width] duration-300 h-[3px] rounded-full bg-[var(--brand)]"></span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[15px] font-semibold">
          {[
            { to: "/", label: "Home" },
            { to: "/explore", label: "Explore" },
            user && { to: "/dashboard", label: "Dashboard" },
            { to: "/trips", label: "Trips" },
            user && { to: "/planner", label: "Planner" },
            { to: "/safety", label: "Safety" },
            { to: "/budget", label: "Budget" },
          ]
            .filter(Boolean)
            .map((item) => (
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
          <button
            onClick={() => setDark((d) => !d)}
            className="group inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-800 hover:text-[var(--brand)] transition-colors dark:text-slate-200"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <span
              aria-hidden
              className="text-2xl leading-none transform transition-transform duration-150 ease-out group-hover:scale-110 active:scale-95"
            >
              {dark ? "🌙" : "☀️"}
            </span>
          </button>
          {!loading && !user && (
            <Link
              to="/auth"
              className="btn-outline hidden lg:inline-flex text-slate-800"
            >
              Login / Signup
            </Link>
          )}
          {!loading && user && (
            <div className="relative" ref={accountRef}>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 p-1.5 hover:bg-slate-50"
                aria-label="Account menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((o) => !o)}
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user.name || user.email || "U"
                  )}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setAccountOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => {
                      setAccountOpen(false);
                      signOut();
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            className="inline-flex items-center gap-2 text-slate-800"
            aria-label="Language"
          >
            <GlobeIcon />
            <span className="hidden lg:inline">EN</span>
          </button>
        </div>

        <div className="md:hidden">
          <button
            className="p-2 text-slate-800 hover:text-[var(--brand)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <HamburgerIcon isOpen={mobileMenuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t border-slate-200/70 transition-all duration-300 ${
            scrolled ? "bg-white/90 backdrop-blur" : "bg-white/60 backdrop-blur"
          }`}
        >
          <div className="container py-4">
            <div className="flex flex-col space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/explore", label: "Explore" },
                user && { to: "/dashboard", label: "Dashboard" },
                { to: "/trips", label: "Trips" },
                user && { to: "/planner", label: "Planner" },
                { to: "/safety", label: "Safety" },
                { to: "/budget", label: "Budget" },
              ]
                .filter(Boolean)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-lg text-base font-semibold transition-colors ${
                        isActive
                          ? "text-[var(--brand)] bg-[var(--brand)]/5"
                          : "text-slate-800 hover:text-[var(--brand)] hover:bg-slate-50"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}

              <div className="pt-3 border-t border-slate-200/70">
                <button
                  className="group w-full flex items-center justify-center py-3 px-4 rounded-lg border border-slate-300 text-slate-800 dark:text-slate-200 dark:border-slate-600"
                  onClick={() => setDark((d) => !d)}
                  aria-label="Toggle dark mode"
                  title="Toggle dark mode"
                >
                  <span
                    aria-hidden
                    className="text-2xl leading-none transform transition-transform duration-150 ease-out group-hover:scale-110 active:scale-95"
                  >
                    {dark ? "🌙" : "☀️"}
                  </span>
                </button>

                {!loading && !user && (
                  <Link
                    to="/auth"
                    className="block w-full text-center py-3 px-4 bg-[var(--brand)] text-white rounded-lg font-semibold hover:bg-[var(--brand)]/90 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login / Signup
                  </Link>
                )}
                {!loading && user && (
                  <div className="grid gap-2">
                    <Link
                      to="/profile"
                      className="block w-full text-center py-3 px-4 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="w-full py-3 px-4 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}

                <button
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 text-slate-600 hover:text-slate-800 transition-colors"
                  aria-label="Language"
                >
                  <GlobeIcon />
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
