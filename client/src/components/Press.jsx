import "./Press.css";

const pressQuotes = [
  {
    source: "thrillist",
    quote:
      "If you're looking for a more 360-degree travel planner, Wanderlog might be a good option for you.",
  },
  {
    source: "Condé Nast Traveler",
    quote:
      "One of the best travel apps for planning every kind of trip, including road trips and group travel.",
  },
  {
    source: "ANDROID AUTHORITY",
    quote:
      "If you're looking for an app to help you plan trips, try Wanderlog. It is the travel planner to end all travel planners.",
  },
];

const Press = () => (
  <section className="press">
    <h2>Recommended by the press</h2>
    <div className="press__list">
      {pressQuotes.map((p, i) => (
        <div className="press__item" key={i}>
          <div className="press__source">{p.source}</div>
          <div className="press__quote">{p.quote}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Press;
