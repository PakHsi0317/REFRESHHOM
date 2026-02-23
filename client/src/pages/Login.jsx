import React, { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { setSession } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    try {
      const data = await login(email, password);
      setSession(data);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="container">
      <h1 className="h1">Login</h1>
      <div className="card">
        <div className="card-body">
          <div className="stack">
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {err && <div style={{ color: "#fca5a5" }}>{err}</div>}
            <button className="btn primary" onClick={submit}>Login</button>
            <div className="muted">No account? <Link to="/register" className="badge">Register</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
