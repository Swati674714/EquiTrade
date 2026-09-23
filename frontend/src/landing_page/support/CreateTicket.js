import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

function CreateTicket() {
  const token = localStorage.getItem("equitrade_token");
  const [form, setForm] = useState({
    category: "Account Opening",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const pickTopic = (category) => {
    setForm((prev) => ({ ...prev, category, subject: category }));
    document.getElementById("ticket-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Login to create a ticket");
      return;
    }
    const next = {};
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message || form.message.length < 10) next.message = "Message must be at least 10 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      await api.post("/api/tickets", form);
      toast.success("Ticket submitted");
      setForm({ ...form, message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit ticket");
    }
  };

  const topics = [
    ["Account Opening", ["Online account opening", "Offline account opening", "NRI account opening", "Getting started"]],
    ["Your EquiTrade Account", ["Login credentials", "Profile and PAN / KYC", "Bank details"]],
    ["Trading desk", ["Order types", "Margins", "Watchlist and alerts"]],
    ["Funds", ["Adding funds", "Withdrawals", "Ledger"]],
  ];

  return (
    <div className="container">
      <div className="row p-4">
        <h2 className="fs-2">To create a ticket, select a topic</h2>
        {topics.map(([title, items]) => (
          <div className="col-md-4 p-4" key={title}>
            <h4>{title}</h4>
            {items.map((item) => (
              <button type="button" className="topic-link" key={item} onClick={() => pickTopic(title)}>
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>

      <form id="ticket-form" className="auth-card mb-5" onSubmit={onSubmit}>
        <h3>Submit a support ticket</h3>
        {!token && (
          <p>
            Please <Link to="/login">login</Link> first. Tickets are tied to your account.
          </p>
        )}
        <label>Category</label>
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <label>Subject</label>
        <input className={errors.subject ? "invalid" : ""} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        {errors.subject && <span className="field-error">{errors.subject}</span>}
        <label>Message</label>
        <textarea className={errors.message ? "invalid" : ""} rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        {errors.message && <span className="field-error">{errors.message}</span>}
        <button className="cta-btn" type="submit">Send ticket</button>
      </form>
    </div>
  );
}

export default CreateTicket;
