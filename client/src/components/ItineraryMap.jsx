import "./ItineraryMap.css";

const ItineraryMap = () => (
  <section className="itinerary-map">
    <div className="itinerary-map__list">
      {/* Itinerary list UI here */}
      <h2>Itinerary Preview</h2>
      <div className="itinerary-map__item">Sample Place 1</div>
      <div className="itinerary-map__item">Sample Place 2</div>
    </div>
    <div className="itinerary-map__map">
      {/* Placeholder for map */}
      <div className="map-placeholder">Map will appear here</div>
    </div>
  </section>
);

export default ItineraryMap;
