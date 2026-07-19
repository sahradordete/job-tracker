import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--ink)",
  fontSize: "0.9rem",
};

const labelStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--ink-soft)",
  marginBottom: "6px",
  display: "block",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Sign in">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {error && (
          <p style={{ color: "var(--status-rejected)", fontSize: "0.85rem", margin: 0 }}>
            {error}
          </p>
        )}

        <div>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: 600,
            marginTop: "8px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", textAlign: "center", margin: 0 }}>
          No account yet? <Link to="/register" style={{ color: "var(--accent)" }}>Register</Link>
        </p>
      </form>
    </AuthCard>
  );
}