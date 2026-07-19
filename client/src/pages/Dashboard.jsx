import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import StatusStamp from "../components/StatusStamp";
import ApplicationForm from "../components/ApplicationForm";

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
  { value: "company", label: "Company (A-Z)" },
];

export default function Dashboard() {
  const { logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null); // null = all
  const [sortBy, setSortBy] = useState("recent");

  async function fetchApplications() {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function handleCreate(data) {
    await api.post("/applications", data);
    setFormOpen(false);
    fetchApplications();
  }

  async function handleUpdate(data) {
    await api.put(`/applications/${editing.id}`, data);
    setEditing(null);
    fetchApplications();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/applications/${id}`);
    fetchApplications();
  }

  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const tally = [
    `${applications.length} total`,
    counts.INTERVIEW ? `${counts.INTERVIEW} interview` : null,
    counts.OFFER ? `${counts.OFFER} offer` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const visibleApplications = useMemo(() => {
    let list = statusFilter
      ? applications.filter((a) => a.status === statusFilter)
      : applications;

    list = [...list].sort((a, b) => {
      if (sortBy === "recent") return new Date(b.appliedAt) - new Date(a.appliedAt);
      if (sortBy === "oldest") return new Date(a.appliedAt) - new Date(b.appliedAt);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });

    return list;
  }, [applications, statusFilter, sortBy]);

  const pillBase = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    borderRadius: "999px",
    padding: "5px 12px",
    cursor: "pointer",
    border: "1px solid var(--border)",
    background: "none",
    color: "var(--ink-soft)",
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Applications
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--ink-soft)",
              margin: "4px 0 0",
            }}
          >
            {tally || "0 total"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <ThemeToggle />
          <button
            onClick={() => setFormOpen(true)}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            + Nova
          </button>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "8px 14px",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "28px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setStatusFilter(null)}
            style={{
              ...pillBase,
              borderColor: statusFilter === null ? "var(--accent)" : "var(--border)",
              color: statusFilter === null ? "var(--accent)" : "var(--ink-soft)",
            }}
          >
            All
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                ...pillBase,
                borderColor: statusFilter === s ? `var(--status-${s.toLowerCase()})` : "var(--border)",
                color: statusFilter === s ? `var(--status-${s.toLowerCase()})` : "var(--ink-soft)",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: "var(--bg-raised)",
            color: "var(--ink)",
            cursor: "pointer",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", marginTop: "16px" }}>
        {loading ? (
          <p style={{ color: "var(--ink-soft)", padding: "24px 0" }}>Loading...</p>
        ) : visibleApplications.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", padding: "24px 0" }}>
            {applications.length === 0
              ? "No applications yet. Add your first one to start tracking."
              : "No applications match this filter."}
          </p>
        ) : (
          visibleApplications.map((app) => (
            <div
              key={app.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto auto auto",
                gap: "16px",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontWeight: 600 }}>{app.company}</span>
              <span style={{ color: "var(--ink-soft)" }}>{app.role}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  color: "var(--ink-soft)",
                }}
              >
                {new Date(app.appliedAt).toLocaleDateString("en-GB")}
              </span>
              <StatusStamp status={app.status} />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setEditing(app)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink-soft)",
                    fontSize: "0.8rem",
                    textDecoration: "underline",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--status-rejected)",
                    fontSize: "0.8rem",
                    textDecoration: "underline",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen && (
        <ApplicationForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
      )}

      {editing && (
        <ApplicationForm
          initialData={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}