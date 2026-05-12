import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:5000/api";

// ── API Hook ─────────────────────────────────────────────
function useApi() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("ss_token")
  );

  const call = useCallback(
    async (path, opts = {}) => {
      const res = await fetch(`${API}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...opts,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    [token]
  );

  return { token, setToken, call };
}

// ── UI Components (Glass, Spinner, Toast) ───────────────
function Glass({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,107,53,0.2)",
          borderTopColor: "#FF6B35",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        background: type === "error" ? "#E74C3C" : "#2ECC71",
        color: "#fff",
        padding: "14px 24px",
        borderRadius: 14,
        fontWeight: 600,
      }}
    >
      {msg}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const { token, setToken, call } = useApi();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  if (!token) {
    return <div>Please connect your AuthScreen here</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f1a" }}>
      <div style={{ width: 240, padding: 20 }}>
        <h3>SpendSense</h3>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("expenses")}>Expenses</button>
        <button onClick={() => setPage("budgets")}>Budgets</button>
        <button onClick={() => setPage("analytics")}>Analytics</button>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        {page === "dashboard" && <div>Dashboard Page</div>}
        {page === "expenses" && <div>Expenses Page</div>}
        {page === "budgets" && <div>Budgets Page</div>}
        {page === "analytics" && <div>Analytics Page</div>}
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}

