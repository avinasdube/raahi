import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import ProtectedRoute, { PublicOnly } from "./components/ProtectedRoute";
import { ToastProvider } from "./components/ToastProvider";
import Auth from "./pages/Auth";
import Budget from "./pages/Budget";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Management from "./pages/Management";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import Safety from "./pages/Safety";
import SearchResults from "./pages/SearchResults";
import Trips from "./pages/Trips";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          {/* Redirect legacy routes to Explore with tab */}
          <Route
            path="/hotels"
            element={<Navigate to="/explore/stays" replace />}
          />
          <Route path="/trips" element={<Trips />} />
          <Route path="/saved" element={<Navigate to="/trips" replace />} />
          <Route
            path="/auth"
            element={
              <PublicOnly>
                <Auth />
              </PublicOnly>
            }
          />
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <Planner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={<Navigate to="/explore/market" replace />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route
            path="/explore/stays"
            element={<Explore initialTab="stays" />}
          />
          <Route
            path="/explore/market"
            element={<Explore initialTab="market" />}
          />
          <Route path="/management" element={<Management />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Fallback: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
