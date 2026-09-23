import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({ prices: {}, connected: false });

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const [prices, setPrices] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3002", {
      auth: { token },
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("prices", (list) => {
      const map = {};
      (list || []).forEach((item) => {
        map[item.symbol] = item;
      });
      setPrices(map);
    });
    socket.on("alert", (payload) => {
      toast.success(`${payload.symbol} crossed ₹${payload.targetPrice} (now ₹${payload.lastPrice})`);
    });

    return () => socket.disconnect();
  }, [token]);

  const value = useMemo(() => ({ prices, connected }), [prices, connected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function usePrices() {
  return useContext(SocketContext);
}
