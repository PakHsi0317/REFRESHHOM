import React, { useState } from "react";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { setSession } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    try {
      const data = await register(name, email, password);
      setSession(data);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="container">
      <h1 className="h1">Register</h1>
      <div className="card">
        <div className="card-body">
          <div className="stack">
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {err && <div style={{ color: "#fca5a5" }}>{err}</div>}
            <button className="btn primary" onClick={submit}>Create Account</button>
            <div className="muted">Already have one? <Link to="/login" className="badge">Login</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
