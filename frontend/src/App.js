import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home';
import Events from './Events';
import Announcements from './Announcements';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>

        {/* NAVBAR */}
        <nav style={navStyle}>
          <h2 style={{ color: 'white', margin: 0 }}>
            Cabagan LGU
          </h2>

          {/* DESKTOP MENU */}
          <div style={desktopMenu}>
            <Link to="/" style={link}>Home</Link>
            <Link to="/events" style={link}>Events</Link>
            <Link to="/announcements" style={link}>Announcements</Link>
          </div>

          {/* HAMBURGER BUTTON */}
          <div style={hamburger} onClick={() => setOpen(!open)}>
            ☰
          </div>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div style={mobileMenu}>
            <Link to="/" style={mobileLink} onClick={() => setOpen(false)}>Home</Link>
            <Link to="/events" style={mobileLink} onClick={() => setOpen(false)}>Events</Link>
            <Link to="/announcements" style={mobileLink} onClick={() => setOpen(false)}>Announcements</Link>
          </div>
        )}

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/announcements" element={<Announcements />} />
        </Routes>

      </div>
    </Router>
  );
}

/* ================= STYLES ================= */

const navStyle = {
  background: '#2c7be5',
  padding: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const desktopMenu = {
  display: 'flex',
  gap: '20px'
};

const link = {
  color: 'white',
  textDecoration: 'none'
};

const hamburger = {
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
  display: 'none'
};

const mobileMenu = {
  background: '#2c7be5',
  display: 'flex',
  flexDirection: 'column',
  padding: '10px'
};

const mobileLink = {
  color: 'white',
  padding: '10px 0',
  textDecoration: 'none'
};

/* ================= RESPONSIVE ================= */

// 👇 THIS IS THE TRICK
const style = document.createElement('style');
style.innerHTML = `
@media (max-width: 768px) {
  div[style*="display: flex"][style*="gap: 20px"] {
    display: none !important;
  }

  div[style*="font-size: 24px"] {
    display: block !important;
  }
}
`;
document.head.appendChild(style);

export default App;