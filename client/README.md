# Raahi – Travel & Stays (Frontend)

Welcome to Raahi, a modern travel website frontend that helps you discover hotels and plan trips with a clean, friendly interface. This document explains what the site offers, how to use it, and how it works behind the scenes — in simple language.

## What you can do here

- Search for places to stay using a quick search bar on the Home page.
- Browse hotels with filters (location, price, collections) and sorting (price, rating).
	- Dataset expanded to 60 India-centric stays across Delhi, Jaipur, Goa, Mumbai, Udaipur, and Manali — great for testing filters and pagination.
- See hotel details, amenities, and actions like View Details or Book Now.
- Save or plan trips (placeholder pages for now) to visualize future features.
- Create or log into an account (UI only) with a beautiful, consistent design.
- Explore a city map with highlighted landmarks to get a feel for the area.
-
- NEW: AI-Powered Smart Travel Planner — Set your city, budget, season, interests, and days; get a personalised day-by-day plan with live tips. Includes an in-browser AI assistant powered by WebLLM (no API keys needed).
- NEW: Tourism Marketplace — Discover hotels, homestays, guides, experiences, and local shops with simple booking/contact actions and UPI-ready mock checkout.
- NEW: Smart Hotel Management — Contactless check-in/out (QR/Face ID mocks) and digital room key demo.
- NEW: Tourist Safety & Assistance — Quick helplines (English/Hindi), nearby facilities (mock), alerts, and a panic button.
- NEW: Dynamic Currency & Budget Tracker — Log expenses, convert to home currency (mock FX), and get budget alerts.

## Who this is for

- Travelers who want a simple and fast way to explore options.
- Designers and product folks who want to review the experience and flow.
- Developers who want a clean React + Vite + Tailwind codebase to build on.

## The main pages at a glance

- Home (`/`)
	- Big beautiful hero section with a city image and a search bar.
	- Benefits highlights, featured destinations, guest testimonials.
	- A small interactive map showing notable areas in a sample city.

- Hotels (`/hotels`)
	- Filter sidebar: popular locations, price slider, and collections.
	- Sort by popularity, price (low to high), or rating.
	- Results show as clean hotel cards with rating, amenities, and CTAs.
	- Active filter “chips” and pagination help you navigate large lists.
	- Your selections sync with the URL so you can share the exact view.

- Search Results (`/search`)
	- Shows results based on what you typed in the Home search bar.
	- Same card layout for consistency with the Hotels page.

- Hotel Details (`/hotel/:id`)
	- A simple details page with images, amenities, and a booking sidebar.

- Trips (`/trips`) and Saved (`/saved`)
	- Friendly placeholders with guidance and calls-to-action.

- Auth (`/auth`)
	- A modern login/signup interface (UI only) with a split layout.

## How it looks and feels

- Clean, airy design using Tailwind CSS for fast and consistent styling.
- A sticky, smart header that stays readable over images.
- Tasteful reveal animations that make content appear smoothly as you scroll.
- Consistent spacing, rounded corners, and subtle shadows for a premium feel.

## How it works (in simple terms)

- This is a “frontend-only” app built with React. That means it runs in your browser and doesn’t require a server to view the pages.
- For hotel data and search, it currently uses in-memory mock data. You can replace these with real APIs later.
- The Hotels page filters and sorting are “controlled” — when you click a filter or change price, the results update immediately.
- The URL updates to reflect your filter choices (for example, `?popular=Mahipalpur&priceMax=2500`), so you can copy and share the exact view.
- The mini map uses Leaflet (a popular open-source mapping library) and OpenStreetMap tiles, loaded from a public CDN. No API key is needed for the basic map.

## Technology used (brief)

- React + Vite for the application and fast development.
- React Router for navigating between pages.
- Tailwind CSS for styling.
- Axios (installed) for future API calls; current data is mocked.
- Leaflet + OpenStreetMap for the map view (via CDN).
	  - AI Planner: In-browser AI via @mlc-ai/web-llm (Llama 3.1 8B instruct, quantized) with streaming responses. No server or API keys required. First model load can take a minute and is cached by the browser. Works best on modern Chromium browsers with WebGPU.
	- Marketplace: In-memory listings; mock UPI/rewards actions.
	- Smart Management: UI-only flows for QR/Face ID and digital keys.
	- Safety & Assistance: Localized helplines (EN/HI), mock alerts and facilities.
	- Budget Tracker: Mock FX conversion table; persists expenses in localStorage.

## How to run it on your computer (Windows)

Prerequisites:
- Node.js 18+ installed

Steps:
1. Open a terminal in the `client` folder.
2. Install dependencies:

	 ```bash
	 npm install
	 ```

3. Start the development server:

	 ```bash
	 npm run dev
	 ```

4. Open the local URL shown in the terminal (usually http://localhost:5173/).

That’s it! Changes you make in the code will refresh the page automatically.

### About the AI Assistant (WebLLM)

- Runs entirely in your browser using WebGPU where available; falls back to CPU/wasm if needed (slower).
- First time you open Planner and use AI, the model downloads and compiles — this may take a minute. It’s cached for future sessions.
- If you don’t see a response or you get an init error, try a recent Chrome/Edge version and reload the Planner page.
- The assistant is tuned for India-first travel suggestions and itineraries.

## Where things live in the code

- `src/pages/Home.jsx` — Home page with hero, search, benefits, destinations, testimonials, and map.
- `src/pages/Hotels.jsx` — Hotels page with filters, sort, chips, and pagination.
- `src/pages/SearchResults.jsx` — Search-driven results page.
- `src/pages/HotelDetails.jsx` — Hotel detail view layout.
- `src/pages/Trips.jsx`, `src/pages/Saved.jsx` — Placeholders with empty states.
- `src/pages/Auth.jsx` — Login/Signup UI.
- New feature pages:
- `src/pages/Planner.jsx` — AI Planner with city, budget, season, interests, and itinerary output.
- `src/pages/Marketplace.jsx` — Listings for hotels/homestays/guides/experiences/shops.
- `src/pages/Management.jsx` — Smart hotel check-in/out and digital key demos.
- `src/pages/Safety.jsx` — Helplines (EN/HI), mock nearby facilities, alerts, panic button.
- `src/pages/Budget.jsx` — Currency conversion (mock) and expense tracker with alerts.
- `src/components/*` — Shared building blocks like Navbar, Footer, HotelCard, FiltersSidebar, SearchBar, Reveal (animations), MapView.

## Roadmap (what we could add next)

- Real backend search and hotel APIs; hook up Login/Signup flows.
- Sync Search Results filters with the URL (same pattern as Hotels).
- Mobile menu and filter drawer for small screens.
- Better accessibility (keyboard focus, ARIA labels) and internationalization.

## Credits and attributions

- Map library: Leaflet (via CDN)
- Map tiles: © OpenStreetMap contributors
- Images: Local asset(s) and Unsplash demo images (for development/testing)

Note: All new features are currently frontend demos using mock data and heuristics. They are designed to be API-ready — you can connect real services (weather, transport, crowd data, payments, identity) when available.

If you use this in production, make sure to review each provider’s terms and attribution requirements.

---

Questions or ideas? Feel free to open an issue or share feedback. Enjoy exploring Raahi!
