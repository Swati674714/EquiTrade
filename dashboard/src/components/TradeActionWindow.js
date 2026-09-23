import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import GeneralContext from "./GeneralContext";
import api from "../api/axios";
import { usePrices } from "../context/SocketContext";
import "./BuyActionWindow.css";

const TradeActionWindow = ({ uid, mode }) => {
  const { closeTradeWindow } = useContext(GeneralContext);
  const { prices } = usePrices();
  const live = prices[uid]?.lastPrice;
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(live || 0);
  const [orderType, setOrderType] = useState("MARKET");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (live && orderType === "MARKET") {
      setStockPrice(live);
    }
  }, [live, orderType]);

  useEffect(() => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);
    if (!qty || !price) return undefined;
    const timer = setTimeout(() => {
      api
        .post("/api/orders/preview", {
          name: uid,
          qty,
          price,
          mode,
          orderType,
        })
        .then((res) => setPreview(res.data))
        .catch(() => setPreview(null));
    }, 250);
    return () => clearTimeout(timer);
  }, [uid, stockQuantity, stockPrice, mode, orderType]);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/api/orders", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
        orderType,
      });
      const status = res.data.order?.status;
      toast.success(status === "PENDING" ? "Limit order placed" : `${mode} order executed`);
      closeTradeWindow();
    } catch (err) {
      const message = err.response?.data?.message || "Could not place order";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container trade-window" id="buy-window">
      <div className="trade-head">
        <strong>{mode} {uid}</strong>
        <span>LTP ₹{(live || stockPrice || 0).toFixed?.(2) || live}</span>
      </div>
      <div className="order-type-toggle">
        <button type="button" className={orderType === "MARKET" ? "active" : ""} onClick={() => setOrderType("MARKET")}>
          Market
        </button>
        <button type="button" className={orderType === "LIMIT" ? "active" : ""} onClick={() => setOrderType("LIMIT")}>
          Limit
        </button>
      </div>
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              disabled={orderType === "MARKET"}
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>
      {preview && (
        <div className="charges-box">
          <p>Turnover ₹{preview.turnover}</p>
          <p>Brokerage ₹{preview.brokerage} · STT ₹{preview.stt} · GST ₹{preview.gst}</p>
          <p>
            {mode === "BUY" ? "You pay" : "You receive"} ₹{preview.netAmount}
          </p>
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
      <div className="buttons">
        <span>Simulated charges included</span>
        <div>
          <button className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`} onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Placing..." : mode}
          </button>
          <button className="btn btn-grey" onClick={closeTradeWindow} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeActionWindow;
