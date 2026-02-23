import { http } from "./http";

export async function fetchInquiriesByListing(listingId) {
  const { data } = await http.get(`/inquiries/listing/${listingId}`);
  return data;
}

export async function createInquiry(listingId, message) {
  const { data } = await http.post("/inquiries", { listingId, message });
  return data;
}
