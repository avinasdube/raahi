import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container pt-24 pb-10">Loading…</div>;
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?next=${next}`} replace />;
  }
  return children;
}

export function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container pt-24 pb-10">Loading…</div>;
  if (user) {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    return <Navigate to={next || "/"} replace />;
  }
  return children;
}
