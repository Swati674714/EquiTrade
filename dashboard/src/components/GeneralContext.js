import React, { useState } from "react";
import TradeActionWindow from "./TradeActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  openSellWindow: () => {},
  closeTradeWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [mode, setMode] = useState("BUY");

  const openBuyWindow = (uid) => {
    setSelectedStockUID(uid);
    setMode("BUY");
    setIsOpen(true);
  };

  const openSellWindow = (uid) => {
    setSelectedStockUID(uid);
    setMode("SELL");
    setIsOpen(true);
  };

  const closeTradeWindow = () => {
    setIsOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider value={{ openBuyWindow, openSellWindow, closeTradeWindow }}>
      {props.children}
      {isOpen && <TradeActionWindow uid={selectedStockUID} mode={mode} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
