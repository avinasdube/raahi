import { useEffect, useMemo, useState } from "react";
import { logout as apiLogout, currentUser } from "../api/api";
import { showSuccess } from "../utils/toast";
import { AuthCtx } from "./auth-store";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await currentUser();
        if (!mounted) return;
        setUser(data?.user || null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      await apiLogout();
    } finally {
      try {
        localStorage.removeItem("raahi.token");
      } catch {
        // ignore storage errors
      }
      setUser(null);
      showSuccess("You have been logged out");
    }
  };

  const value = useMemo(
    () => ({ user, setUser, loading, signOut }),
    [user, loading]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
