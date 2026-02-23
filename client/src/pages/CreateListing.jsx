import React, { useState } from "react";
import { createListing } from "../api/listings";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr("");
    if (!title.trim()) return setErr("Title required");
    if (price === "" || Number.isNaN(Number(price))) return setErr("Valid price required");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("price", price);
    fd.append("description", desc);
    for (const f of files) fd.append("images", f);

    try {
      setBusy(true);
      const listing = await createListing(fd);
      nav(`/listing/${listing._id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <h1 className="h1">Create Listing</h1>
      <div className="card">
        <div className="card-body">
          <div className="stack">
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="input" placeholder="Price (e.g., 30)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <textarea className="input" rows={5} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <input className="input" type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            {err && <div style={{ color: "#fca5a5" }}>{err}</div>}
            <button className="btn primary" disabled={busy} onClick={submit}>
              {busy ? "Creating..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
