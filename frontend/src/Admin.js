import { useState } from "react";

const API = "https://cabagan-backend.onrender.com";

function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) return alert("Enter credentials");

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) return alert("Invalid login ❌");

    const data = await res.json();
    localStorage.setItem("token", data.token);

    alert("Login successful ✅");
    window.location.href = "/";
  };

  return (
    <div style={page}>
      <div style={card}>
        {/* HEADER */}
        <div style={header}>
          <h1 style={title}>🌾 Cabagan LGU</h1>
          <p style={subtitle}>Admin Access Portal</p>
        </div>

        {/* FORM */}
        <input
          style={input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          style={input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={btn} onClick={login}>
          🔐 Login
        </button>
      </div>
    </div>
  );
}

/* 🌾 STYLES */

const page = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #e8f5e9, #f1f8f5)"
};

const card = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  textAlign: "center"
};

const header = {
  marginBottom: "20px"
};

const title = {
  color: "#2e7d32",
  marginBottom: "5px"
};

const subtitle = {
  color: "#777",
  fontSize: "14px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const btn = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px"
};

export default Admin;