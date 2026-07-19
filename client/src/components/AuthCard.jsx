import ThemeToggle from "./ThemeToggle";

export default function AuthCard({ title, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "24px", right: "24px" }}>
        <ThemeToggle />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "32px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            margin: "0 0 4px",
          }}
        >
          Job Tracker
        </p>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 24px" }}>
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}