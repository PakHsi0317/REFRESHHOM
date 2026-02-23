import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSocket } from "../api/socket";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const s = getSocket();
    if (token) s.emit("auth", token);
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthed: !!user,
    setSession: ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
