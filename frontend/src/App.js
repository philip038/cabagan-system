import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import Home from './Home';
import Events from './Events';
import Announcements from './Announcements';
import Admin from './Admin';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

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

            {isLoggedIn && (
              <button onClick={logout} style={logoutBtn}>
                Logout
              </button>
            )}
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

            {isLoggedIn && (
              <button onClick={logout} style={mobileLogout}>
                Logout
              </button>
            )}
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
          align-items: center;
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

const logoutBtn = {
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer'
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

const mobileLogout = {
  background: '#e74c3c',
  color: 'white',
  padding: '10px',
  border: 'none',
  marginTop: '10px',
  borderRadius: '6px'
};

export default App;