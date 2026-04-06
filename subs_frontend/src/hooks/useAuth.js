import { useEffect, useState } from "react";
import { getMe } from "../features/auth/authService";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const hydrateUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await getMe();
        if (!active) return;

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        if (!active) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    hydrateUser();

    return () => {
      active = false;
    };
  }, []);

  return {
    user,
    loading,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };
};