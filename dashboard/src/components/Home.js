import React from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { SocketProvider } from "../context/SocketContext";

const Home = () => {
  return (
    <SocketProvider>
      <TopBar />
      <Dashboard />
    </SocketProvider>
  );
};

export default Home;
