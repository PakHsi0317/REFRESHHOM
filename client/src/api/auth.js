import { http } from "./http";

export async function login(email, password) {
  const { data } = await http.post("/auth/login", { email, password });
  return data;
}

export async function register(name, email, password) {
  const { data } = await http.post("/auth/register", { name, email, password });
  return data;
}
