import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      login(res.data.token, res.data.user);
      toast.success("Welcome back");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>EquiTrade</h1>
        <p>Sign in to your trading desk</p>
        <label>Email</label>
        <input
          className={errors.email ? "invalid" : ""}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
        <label>Password</label>
        <input
          className={errors.password ? "invalid" : ""}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <span className="field-error">{errors.password}</span>}
        <button className="btn btn-green" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Login"}
        </button>
        <p className="auth-alt">
          New here? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
}
