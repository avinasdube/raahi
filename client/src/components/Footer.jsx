const StoreBadge = ({ type = "apple" }) => (
  <a
    href="#"
    className="inline-flex items-center gap-3 bg-black text-white rounded-xl px-3 py-2 hover:opacity-90"
    aria-label={
      type === "apple" ? "Download on the App Store" : "Get it on Google Play"
    }
  >
    {type === "apple" ? (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden
      >
        <path d="M16.365 1.43c.09 1.1-.32 2.17-.99 2.97-.67.8-1.8 1.42-2.89 1.34-.1-1.06.37-2.14 1.01-2.86.71-.83 1.92-1.43 2.87-1.45zM20.64 17.37c-.49 1.14-1.07 2.27-1.9 3.3-.64.8-1.37 1.7-2.36 1.72-.95.02-1.26-.56-2.36-.56s-1.44.54-2.36.58c-.97.04-1.71-.86-2.35-1.66-1.28-1.57-2.26-3.97-1.88-6.27.19-1.2.75-2.33 1.6-3.15.74-.72 1.73-1.26 2.78-1.28.98-.02 1.9.65 2.36.65.46 0 1.67-.8 2.81-.68.48.02 1.81.19 2.67 1.42-.07.05-1.6.94-1.58 2.8.02 2.23 1.94 2.96 1.97 2.97z" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden
      >
        <path d="M3 2.5l11.5 9.5L3 21.5V2.5zm13.4 8.6L6 3.8l9.7 9.2-2.5 2.4 3.2 1.9L21 12l-4.6-1z" />
      </svg>
    )}
    <div className="leading-4">
      <div className="text-[10px] opacity-80">
        {type === "apple" ? "Download on the" : "GET IT ON"}
      </div>
      <div className="text-sm font-bold">
        {type === "apple" ? "App Store" : "Google Play"}
      </div>
    </div>
  </a>
);

const Footer = () => {
  const sitemapCols = [
    [
      "Hotels near me",
      "Hotels in Manali",
      "Hotels in Nainital",
      "Hotels in Mount Abu",
      "Hotels in Agra",
      "Hotels in Haridwar",
    ],
    [
      "Hotels in Goa",
      "Hotels in Udaipur",
      "Hotels in Lonavala",
      "Hotels in Kodaikanal",
      "Hotels in Gangtok",
      "Hotels in Kolkata",
    ],
    [
      "Hotels in Jaipur",
      "Hotels in Delhi",
      "Hotels in Mysore",
      "Hotels in Chandigarh",
      "Hotels in Tirupati",
      "Hotels in Rishikesh",
    ],
    [
      "Hotels in Shimla",
      "Hotels in Mumbai",
      "Hotels in Darjeeling",
      "Hotels in Shirdi",
      "Hotels in Dalhousie",
      "Hotels in Varanasi",
    ],
  ];

  return (
    <footer className="mt-16 bg-slate-800 text-slate-200">
      <div className="container py-8">
        {/* Top brand bar */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 pb-8 border-b border-slate-700">
          <div className="flex items-center gap-3 text-center lg:text-left">
            <span className="text-2xl font-extrabold text-white">Raahi</span>
            <span className="text-slate-300">
              World's leading chain of hotels and homes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-outline text-white/90 border-white/20">
              List your property
            </button>
            <button className="btn-outline text-white/90 border-white/20 hidden md:inline-flex">
              Become a partner
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 py-8 border-b border-slate-700">
          <div>
            <div className="font-semibold mb-3">
              Download our app for exciting offers
            </div>
            <div className="flex gap-3">
              <StoreBadge type="apple" />
              <StoreBadge type="android" />
            </div>
            <form className="mt-5 flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 h-11 rounded-xl border border-white/20 bg-white/5 px-4 placeholder:text-slate-400 text-slate-100"
              />
              <button
                type="button"
                className="h-11 px-4 rounded-xl bg-white/10 text-white hover:bg-white/15"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Teams / Careers</li>
              <li>Blogs</li>
              <li>Support</li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li>Terms & conditions</li>
              <li>Guest Policies</li>
              <li>Privacy Policy</li>
              <li>Trust and Safety</li>
            </ul>
          </div>
        </div>

        <div className="py-8">
          <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-slate-300">
            {sitemapCols.map((col, i) => (
              <ul key={i} className="space-y-2">
                {col.map((item) => (
                  <li key={item} className="hover:text-white cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} Raahi. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <select className="select-control select-sm bg-transparent text-slate-300">
                <option className="bg-slate-800">English (EN)</option>
                <option className="bg-slate-800">हिन्दी (HI)</option>
              </select>
              <select className="select-control select-sm bg-transparent text-slate-300">
                <option className="bg-slate-800">INR (₹)</option>
                <option className="bg-slate-800">USD ($)</option>
              </select>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <a aria-label="Twitter" href="#" className="hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.15 12.15 0 013 4.9a4.28 4.28 0 001.32 5.71 4.22 4.22 0 01-1.94-.54v.06a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97A8.58 8.58 0 012 19.54 12.1 12.1 0 008.56 21c7.4 0 11.45-6.14 11.45-11.45 0-.17 0-.34-.01-.51A8.18 8.18 0 0022.46 6z" />
                </svg>
              </a>
              <a aria-label="Facebook" href="#" className="hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden
                >
                  <path d="M22 12a10 10 0 10-11.5 9.95v-7.04H7.9v-2.9h2.6V9.41c0-2.56 1.53-3.98 3.87-3.98 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62v1.95h2.84l-.45 2.9h-2.39v7.04A10 10 0 0022 12z" />
                </svg>
              </a>
              <a aria-label="Instagram" href="#" className="hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden
                >
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3.5A5.5 5.5 0 1111.999 20.5 5.5 5.5 0 0112 7.5zm0 2A3.5 3.5 0 1015.5 13 3.5 3.5 0 0012 9.5zM18 6.2a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </a>
              <a aria-label="YouTube" href="#" className="hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden
                >
                  <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.2 31.2 0 000 12a31.2 31.2 0 00.5 5.8 3 3 0 002.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.2 31.2 0 0024 12a31.2 31.2 0 00-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
