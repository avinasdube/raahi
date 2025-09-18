import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Budget from "./pages/Budget";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Management from "./pages/Management";
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
        {/* Redirect legacy routes to Explore with tab */}
        <Route
          path="/hotels"
          element={<Navigate to="/explore?tab=stays" replace />}
        />
        <Route path="/trips" element={<Trips />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/planner" element={<Planner />} />
        <Route
          path="/marketplace"
          element={<Navigate to="/explore?tab=market" replace />}
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="/management" element={<Management />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </Router>
  );
}

export default App;
