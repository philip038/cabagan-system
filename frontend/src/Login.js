import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAdmin", "true");
      alert("Login successful ✅");
      window.location.href = "/";
    } else {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f4f6f9'
    }}>

      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        width: '300px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>

        <h2 style={{ marginBottom: '20px' }}>
          🔐 Admin Login
        </h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <button
          onClick={login}
          style={{
            width: '100%',
            background: '#2c7be5',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;