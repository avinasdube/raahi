import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Budget from "./pages/Budget";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Hotels from "./pages/Hotels";
import Management from "./pages/Management";
import Marketplace from "./pages/Marketplace";
import Planner from "./pages/Planner";
import Safety from "./pages/Safety";
import Saved from "./pages/Saved";
import SearchResults from "./pages/SearchResults";
import Trips from "./pages/Trips";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/management" element={<Management />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </Router>
  );
}

export default App;
