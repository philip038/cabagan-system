import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import Home from './Home';
import Events from './Events';
import Announcements from './Announcements';
import Admin from './Admin';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>

        {/* NAVBAR */}
        <nav style={nav}>
          <h2 style={logo}>Cabagan LGU</h2>

          {/* DESKTOP MENU */}
          <div className="desktop-menu">
            <Link to="/" style={link}>Home</Link>
            <Link to="/events" style={link}>Events</Link>
            <Link to="/announcements" style={link}>Announcements</Link>
          </div>

          {/* HAMBURGER */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </nav>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={mobileMenu}>
            <Link to="/" style={mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/events" style={mobileLink} onClick={() => setMenuOpen(false)}>Events</Link>
            <Link to="/announcements" style={mobileLink} onClick={() => setMenuOpen(false)}>Announcements</Link>
          </div>
        )}

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        .desktop-menu {
          display: flex;
          gap: 20px;
        }

        .hamburger {
          display: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }

          .hamburger {
            display: block;
          }
        }
      `}</style>

    </Router>
  );
}

/* STYLES */

const nav = {
  background: '#2c7be5',
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logo = {
  color: 'white',
  margin: 0
};

const link = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500'
};

const mobileMenu = {
  background: '#2c7be5',
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 20px'
};

const mobileLink = {
  color: 'white',
  padding: '10px 0',
  textDecoration: 'none'
};

export default App;