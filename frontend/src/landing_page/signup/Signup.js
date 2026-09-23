import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const DASHBOARD = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", pan: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email) next.email = "Email is required";
    if (!form.password || form.password.length < 6) next.password = "Min 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      const res = await api.post("/api/auth/signup", form);
      localStorage.setItem("equitrade_token", res.data.token);
      localStorage.setItem("equitrade_user", JSON.stringify(res.data.user));
      toast.success("Account created. Opening trading desk...");
      window.location.href = `${DASHBOARD}?token=${encodeURIComponent(res.data.token)}`;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Open an EquiTrade account</h1>
        <p>Free equity delivery. Simulated live market for this demo.</p>
        <label>Full name</label>
        <input className={errors.name ? "invalid" : ""} value={form.name} onChange={set("name")} />
        {errors.name && <span className="field-error">{errors.name}</span>}
        <label>Email</label>
        <input className={errors.email ? "invalid" : ""} type="email" value={form.email} onChange={set("email")} />
        {errors.email && <span className="field-error">{errors.email}</span>}
        <label>Password</label>
        <input className={errors.password ? "invalid" : ""} type="password" value={form.password} onChange={set("password")} />
        {errors.password && <span className="field-error">{errors.password}</span>}
        <label>Phone</label>
        <input value={form.phone} onChange={set("phone")} />
        <label>PAN</label>
        <input value={form.pan} onChange={set("pan")} />
        <button className="cta-btn" disabled={submitting} type="submit">
          {submitting ? "Creating..." : "Sign up"}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
