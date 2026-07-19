import { useState } from "react";

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];

export default function ApplicationForm({ initialData, onSubmit, onCancel }) {
  const [company, setCompany] = useState(initialData?.company || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [status, setStatus] = useState(initialData?.status || "APPLIED");
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!company.trim() || !role.trim()) {
      setError("Company and role are required");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ company, role, status, jobUrl, notes });
    } catch (err) {
      setError(err.response?.data?.error || "Error saving application");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--bg-raised)",
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "28px",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
          {initialData ? "Edit Application" : "New Application"}
        </h2>

        {error && (
          <p style={{ color: "var(--status-rejected)", fontSize: "0.85rem", margin: 0 }}>
            {error}
          </p>
        )}

        <div>
          <label style={labelStyle}>Company</label>
          <input
            style={inputStyle}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Google"
          />
        </div>

        <div>
          <label style={labelStyle}>Role</label>
          <input
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Frontend Engineer"
          />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Job URL (optional)</label>
          <input
            style={inputStyle}
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 600,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}