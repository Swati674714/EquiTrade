import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("equitrade_user") || "null");
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("token");
    if (fromQuery) {
      localStorage.setItem("equitrade_token", fromQuery);
      window.history.replaceState({}, "", window.location.pathname);
      return fromQuery;
    }
    return localStorage.getItem("equitrade_token");
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("equitrade_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("equitrade_token");
        localStorage.removeItem("equitrade_user");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (nextToken, nextUser) => {
    localStorage.setItem("equitrade_token", nextToken);
    localStorage.setItem("equitrade_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("equitrade_token");
    localStorage.removeItem("equitrade_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, setUser, isAdmin: user?.role === "admin" }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
