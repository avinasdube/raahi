import "./Features.css";

const features = [
  {
    title: "Add places from guides with 1 click",
    desc: "Easily add mentioned places to your plan.",
  },
  {
    title: "Expense tracking and splitting",
    desc: "Keep track of your budget and split the cost between your tripmates.",
  },
  {
    title: "Collaborate with friends in real time",
    desc: "Plan along with your friends with live syncing and collaborative editing.",
  },
];

const Features = () => (
  <section className="features">
    <h2>Features to replace all your other tools</h2>
    <div className="features__list">
      {features.map((f, i) => (
        <div className="feature" key={i}>
          <div className="feature__title">{f.title}</div>
          <div className="feature__desc">{f.desc}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
