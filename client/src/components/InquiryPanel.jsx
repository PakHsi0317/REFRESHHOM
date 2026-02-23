import React, { useEffect, useState } from "react";
import { createInquiry, fetchInquiriesByListing } from "../api/inquiries";
import { useAuth } from "../context/AuthContext.jsx";
import { getSocket } from "../api/socket";

export default function InquiryPanel({ listing }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function reload() {
    const data = await fetchInquiriesByListing(listing._id);
    setItems(data);
  }

  useEffect(() => {
    reload().catch(() => {});
    const s = getSocket();
    const handler = (payload) => {
      if (payload.listingId === listing._id) reload().catch(() => {});
    };
    s.on("inquiry:new", handler);
    return () => s.off("inquiry:new", handler);
  }, [listing._id]);

  const isOwner = listing.owner?._id === user?.id;

  async function submit() {
    setErr("");
    const text = msg.trim();
    if (!text) return;
    try {
      await createInquiry(listing._id, text);
      setMsg("");
      await reload();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to send inquiry");
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="row space">
          <div className="h2">Inquiries</div>
          <span className="badge">{isOwner ? "Seller View" : "Buyer View"}</span>
        </div>

        <div className="stack" style={{ marginTop: 10 }}>
          {items.length === 0 ? (
            <div className="muted">No inquiries yet.</div>
          ) : (
            items.map((it) => (
              <div key={it._id} className="card" style={{ boxShadow: "none" }}>
                <div className="card-body">
                  <div className="row space">
                    <div className="badge">From: {it.fromUser?.name}</div>
                    <div className="muted">{new Date(it.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ marginTop: 8 }}>{it.message}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {!isOwner && (
          <>
            <hr />
            <div className="stack">
              <textarea
                className="input"
                rows={3}
                placeholder="Ask a question about this item..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              {err && <div style={{ color: "#fca5a5" }}>{err}</div>}
              <button className="btn primary" onClick={submit}>Send Inquiry</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
