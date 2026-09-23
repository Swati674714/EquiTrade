import React, { useContext, useEffect, useMemo, useState } from "react";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnoutChart";
import CandleChart from "./CandleChart";
import { usePrices } from "../context/SocketContext";
import api from "../api/axios";
import "./WatchList.css";

const WatchList = () => {
  const { prices } = usePrices();
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartSymbol, setChartSymbol] = useState(null);

  useEffect(() => {
    api
      .get("/api/market/watchlist")
      .then((res) => setRows(res.data || []))
      .catch(() => toast.error("Could not load watchlist"))
      .finally(() => setLoading(false));
  }, []);

  const merged = useMemo(() => {
    return rows
      .map((row) => {
        const live = prices[row.symbol];
        return live ? { ...row, ...live, name: row.symbol, price: live.lastPrice } : { ...row, name: row.symbol, price: row.lastPrice };
      })
      .filter((row) => row.symbol.toLowerCase().includes(query.toLowerCase()));
  }, [rows, prices, query]);

  const chartData = {
    labels: merged.map((s) => s.symbol),
    datasets: [
      {
        label: "Price",
        data: merged.map((s) => s.price),
        backgroundColor: ["#00d09c55", "#4184f355", "#ff4d4f55", "#f5c54255", "#9b8cff55", "#4dd4c055"],
        borderColor: ["#00d09c", "#4184f3", "#ff4d4f", "#f5c542", "#9b8cff", "#4dd4c0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: INFY, TCS, RELIANCE"
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="counts">{merged.length} / 50</span>
      </div>
      {loading ? (
        <div className="skeleton-list" />
      ) : (
        <ul className="list">
          {merged.map((stock) => (
            <WatchListItem key={stock.symbol} stock={stock} onChart={setChartSymbol} />
          ))}
        </ul>
      )}
      {chartSymbol && (
        <div className="chart-panel">
          <CandleChart
            symbol={chartSymbol}
            lastPrice={merged.find((s) => s.symbol === chartSymbol)?.price}
          />
        </div>
      )}
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onChart }) => {
  const [hover, setHover] = useState(false);
  const isDown = stock.isDown || stock.changePercent < 0;
  const pct = `${stock.changePercent >= 0 ? "+" : ""}${Number(stock.changePercent || 0).toFixed(2)}%`;

  return (
    <li onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="item">
        <p className={isDown ? "down" : "up"}>{stock.symbol}</p>
        <div className="itemInfo">
          <span className="percent">{pct}</span>
          {isDown ? <KeyboardArrowDown className="down" /> : <KeyboardArrowUp className="up" />}
          <span className="price">{Number(stock.price).toFixed(2)}</span>
        </div>
      </div>
      {hover && <WatchListActions uid={stock.symbol} onChart={onChart} />}
    </li>
  );
};

const WatchListActions = ({ uid, onChart }) => {
  const generalContext = useContext(GeneralContext);
  const [showAlert, setShowAlert] = useState(false);
  const [target, setTarget] = useState("");

  const saveAlert = async () => {
    try {
      await api.post("/api/alerts", {
        symbol: uid,
        targetPrice: Number(target),
        direction: "above",
      });
      toast.success(`Alert set on ${uid}`);
      setShowAlert(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not set alert");
    }
  };

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={() => generalContext.openBuyWindow(uid)}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={() => generalContext.openSellWindow(uid)}>Sell</button>
        </Tooltip>
        <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={() => onChart(uid)}>
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="Price alert" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={() => setShowAlert((v) => !v)}>
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
      {showAlert && (
        <span className="alert-inline">
          <input type="number" placeholder="Target" value={target} onChange={(e) => setTarget(e.target.value)} />
          <button type="button" onClick={saveAlert}>Set</button>
        </span>
      )}
    </span>
  );
};
