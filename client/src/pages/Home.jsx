import React, { useEffect, useState } from "react";
import { fetchListings } from "../api/listings";
import ListingCard from "../components/ListingCard.jsx";

export default function Home() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchListings(q);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  return (
    <div className="container">
      <div className="row space">
        <h1 className="h1">Marketplace</h1>
        <div style={{ width: 360 }}>
          <div className="row" style={{ gap: 10 }}>
            <input
              className="input"
              placeholder="Search listings..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
            <button className="btn" onClick={load}>Search</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="muted">Loading...</div>
      ) : (
        <div className="grid">
          {items.map((it) => <ListingCard key={it._id} listing={it} />)}
        </div>
      )}
    </div>
  );
}
