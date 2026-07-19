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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Create account">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {error && (
          <p style={{ color: "var(--status-rejected)", fontSize: "0.85rem", margin: 0 }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "var(--status-offer)", fontSize: "0.85rem", margin: 0 }}>
            Account created. Redirecting...
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
          {loading ? "Creating..." : "Create account"}
        </button>

        <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", textAlign: "center", margin: 0 }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}