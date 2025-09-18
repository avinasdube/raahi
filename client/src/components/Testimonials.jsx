import "./Testimonials.css";

const testimonials = [
  {
    name: "Nadia",
    text: "Planning your trip by having all the attractions already plugged into a map makes trip planning so much easier.",
  },
  {
    name: "Sharon Brewster",
    text: "Amazing app! Easy to use, love the AI functionality.",
  },
  {
    name: "Jayson Oite",
    text: "Very handy, convenient and very easy to use. It also recommends tourist destinations and nearby places.",
  },
  {
    name: "Erica Franco",
    text: "Absolutely love this app! It is so helpful when planning my trips. Especially love the optimize route option.",
  },
];

const Testimonials = () => (
  <section className="testimonials">
    <h2>What travelers are raving about</h2>
    <div className="testimonials__list">
      {testimonials.map((t, i) => (
        <div className="testimonial" key={i}>
          <div className="testimonial__name">{t.name}</div>
          <div className="testimonial__text">{t.text}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
