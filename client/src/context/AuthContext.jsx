import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, setOnRefreshFail } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOnRefreshFail(() => {
      setUser(null);
    });

    // try to silently restore a session on page load using the refresh cookie
    async function tryRestore() {
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
        const me = await api.get("/auth/me");
        setUser(me.data);
      } catch {
        setAccessToken(null);
      } finally {
        setReady(true);
      }
    }
    tryRestore();
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  }

  async function register(email, password) {
    await api.post("/auth/register", { email, password });
  }

  async function logout() {
  console.log("logout called");
  try {
    await api.post("/auth/logout");
    console.log("logout request succeeded");
  } catch (err) {
    console.error("logout request failed:", err);
  } finally {
    setAccessToken(null);
    setUser(null);
    console.log("user state cleared");
  }
}

  return (
    <AuthContext.Provider value={{ user, login, register, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}