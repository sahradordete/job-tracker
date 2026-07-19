const LABELS = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export default function StatusStamp({ status }) {
  const varName = `--status-${status.toLowerCase()}`;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: `var(${varName})`,
        border: `1px solid var(${varName})`,
        borderRadius: "4px",
        padding: "2px 8px",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: `var(${varName})`,
        }}
      />
      {LABELS[status] || status}
    </span>
  );
}