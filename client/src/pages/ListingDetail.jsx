import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchListing } from "../api/listings";
import { useAuth } from "../context/AuthContext.jsx";
import InquiryPanel from "../components/InquiryPanel.jsx";

export default function ListingDetail() {
  const { id } = useParams();
  const { isAuthed } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchListing(id).then((d) => setItem(d)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container muted">Loading...</div>;
  if (!item) return <div className="container muted">Not found</div>;

  return (
    <div className="container">
      <div className="row" style={{ alignItems: "flex-start", gap: 18 }}>
        <div style={{ flex: 1 }}>
          <div className="card">
            {item.images?.[0]?.url ? (
              <img className="img" style={{ height: 360 }} src={item.images[0].url} alt={item.title} />
            ) : (
              <div className="img" style={{ height: 360 }} />
            )}
            <div className="card-body">
              <div className="row space">
                <div className="h1" style={{ margin: 0 }}>{item.title}</div>
                <span className="badge">${Number(item.price).toFixed(2)}</span>
              </div>
              <div className="muted">Seller: {item.owner?.name} ({item.owner?.email})</div>
              <hr />
              <div>{item.description || <span className="muted">No description.</span>}</div>
            </div>
          </div>
        </div>

        <div style={{ width: 420, maxWidth: "100%" }}>
          {isAuthed ? (
            <InquiryPanel listing={item} />
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="h2">Login to inquire</div>
                <div className="muted">You need an account to send real-time inquiries.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
