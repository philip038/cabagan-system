import { useState } from 'react';

function Admin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const login = () => {
    if (user === 'admin' && pass === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      alert('Login successful ✅');
      window.location.href = '/';
    } else {
      alert('Invalid credentials ❌');
    }
  };

  return (
    <div style={container}>
      <h2>Admin Login</h2>

      <input
        placeholder="Username"
        value={user}
        onChange={e => setUser(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        style={input}
      />

      <button onClick={login} style={btn}>Login</button>
    </div>
  );
}

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 100
};

const input = {
  margin: 10,
  padding: 10,
  width: 200
};

const btn = {
  padding: 10,
  background: '#2c7be5',
  color: '#fff',
  border: 'none'
};

export default Admin;
