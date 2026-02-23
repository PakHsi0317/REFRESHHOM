import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const img = listing.images?.[0]?.url;
  return (
    <Link to={`/listing/${listing._id}`} className="card">
      {img ? <img className="img" src={img} alt={listing.title} /> : <div className="img" />}
      <div className="card-body">
        <div className="row space">
          <div className="h2">{listing.title}</div>
          <span className="badge">${Number(listing.price).toFixed(2)}</span>
        </div>
        <div className="muted">Seller: {listing.owner?.name || "Unknown"}</div>
      </div>
    </Link>
  );
}
