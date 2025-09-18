import "./HeroSection.css";

const HeroSection = () => (
  <section className="hero">
    <h1>One app for all your travel planning needs</h1>
    <p>
      Create detailed itineraries, explore user-shared guides, and manage your
      bookings seamlessly — all in one place.
    </p>
    <div className="hero__cta">
      <button className="hero__start">Start planning</button>
      <button className="hero__getapp">Get the app →</button>
    </div>
  </section>
);

export default HeroSection;
