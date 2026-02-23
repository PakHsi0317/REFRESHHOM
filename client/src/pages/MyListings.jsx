import React, { useEffect, useState } from "react";
import { deleteListing, fetchMyListings, updateListing } from "../api/listings";

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchMyListings();
      setItems(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markSold(id) {
    await updateListing(id, { status: "sold" });
    load();
  }

  async function remove(id) {
    await deleteListing(id);
    load();
  }

  return (
    <div className="container">
      <h1 className="h1">My Listings</h1>
      {loading ? (
        <div className="muted">Loading...</div>
      ) : err ? (
        <div style={{ color: "#fca5a5" }}>{err}</div>
      ) : items.length === 0 ? (
        <div className="muted">No listings yet.</div>
      ) : (
        <div className="stack">
          {items.map((it) => (
            <div key={it._id} className="card">
              <div className="card-body">
                <div className="row space">
                  <div>
                    <div className="h2">{it.title}</div>
                    <div className="muted">${Number(it.price).toFixed(2)} · {it.status}</div>
                  </div>
                  <div className="row">
                    {it.status !== "sold" && (
                      <button className="btn" onClick={() => markSold(it._id)}>Mark Sold</button>
                    )}
                    <button className="btn" onClick={() => remove(it._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
