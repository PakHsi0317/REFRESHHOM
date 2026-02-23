import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const nav = useNavigate();
  const { user, isAuthed, logout } = useAuth();

  return (
    <div className="nav">
      <Link className="brand" to="/">REFRESHHOM</Link>
      <div className="row">
        <Link className="btn" to="/">Marketplace</Link>
        {isAuthed && <Link className="btn" to="/create">New Listing</Link>}
        {isAuthed && <Link className="btn" to="/me">My Listings</Link>}

        {!isAuthed ? (
          <>
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn primary" to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="badge">Hi, {user?.name}</span>
            <button className="btn" onClick={() => { logout(); nav("/"); }}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
