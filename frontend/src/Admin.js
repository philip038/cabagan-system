import { useState } from 'react';

const API = "https://cabagan-backend.onrender.com";

function Admin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });

    if (!res.ok) return alert("Invalid login ❌");

    const data = await res.json();

    localStorage.setItem('token', data.token);
    alert("Login success ✅");
    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>Admin Login</h2>

      <input placeholder="Username" onChange={e => setUser(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} /><br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Admin;