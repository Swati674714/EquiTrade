import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [txns, setTxns] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [f, t] = await Promise.all([api.get("/api/funds"), api.get("/api/funds/transactions")]);
    setFunds(f.data);
    setTxns(t.data || []);
  };

  useEffect(() => {
    load().catch(() => toast.error("Could not load funds"));
  }, []);

  const act = async (path) => {
    setError("");
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Enter a valid amount");
      return;
    }
    try {
      await api.post(`/api/funds/${path}`, { amount: value });
      toast.success(path === "add" ? "Money added" : "Withdrawal successful");
      setAmount("");
      load();
    } catch (err) {
      const message = err.response?.data?.message || "Request failed";
      setError(message);
      toast.error(message);
    }
  };

  if (!funds) return <div className="skeleton-table" />;

  return (
    <>
      <div className="funds">
        <p>Simulated wallet — instant add and withdraw</p>
        <input
          className={error ? "invalid" : ""}
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-green" onClick={() => act("add")}>Add funds</button>
        <button className="btn btn-blue" onClick={() => act("withdraw")}>Withdraw</button>
      </div>
      {error && <p className="field-error">{error}</p>}

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>
          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{funds.availableMargin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{funds.usedMargin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{funds.availableCash.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Wallet balance</p>
              <p>{funds.walletBalance.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Reserved (pending buys)</p>
              <p>{funds.reservedBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <h4>Transaction history</h4>
          {!txns.length ? (
            <p className="muted">No fund movements yet.</p>
          ) : (
            <div className="order-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((row) => (
                    <tr key={row._id}>
                      <td>{row.type}</td>
                      <td className={row.amount >= 0 ? "profit" : "loss"}>{row.amount.toFixed(2)}</td>
                      <td>{row.balanceAfter.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Funds;
