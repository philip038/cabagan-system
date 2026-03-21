import { useState } from 'react';

const API = "https://cabagan-backend.onrender.com";

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
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
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>🔐 Admin Login</h2>

      <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Admin;