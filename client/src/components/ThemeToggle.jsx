import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema"
      style={{
        background: "none",
        border: "1px solid var(--border)",
        borderRadius: "999px",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        color: "var(--ink)",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {theme === "light" ? "☾" : "☀"}
    </button>
  );
}