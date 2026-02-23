import { http } from "./http";

export async function fetchListings(q = "") {
  const { data } = await http.get(`/listings?q=${encodeURIComponent(q)}`);
  return data;
}

export async function fetchListing(id) {
  const { data } = await http.get(`/listings/${id}`);
  return data;
}

export async function fetchMyListings() {
  const { data } = await http.get(`/listings/me/mine`);
  return data;
}

export async function createListing(formData) {
  const { data } = await http.post("/listings", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function updateListing(id, payload) {
  const { data } = await http.put(`/listings/${id}`, payload);
  return data;
}

export async function deleteListing(id) {
  const { data } = await http.delete(`/listings/${id}`);
  return data;
}
