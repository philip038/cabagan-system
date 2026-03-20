import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAdmin", "true");
      alert("Login successful");
      window.location.href = "/";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;