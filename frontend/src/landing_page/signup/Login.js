import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const DASHBOARD = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("equitrade_token", res.data.token);
      localStorage.setItem("equitrade_user", JSON.stringify(res.data.user));
      toast.success("Logged in");
      window.location.href = `${DASHBOARD}?token=${encodeURIComponent(res.data.token)}`;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Login to EquiTrade</h1>
        <label>Email</label>
        <input className={errors.email ? "invalid" : ""} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {errors.email && <span className="field-error">{errors.email}</span>}
        <label>Password</label>
        <input className={errors.password ? "invalid" : ""} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {errors.password && <span className="field-error">{errors.password}</span>}
        <button className="cta-btn" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Login"}
        </button>
        <p>
          New to EquiTrade? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
