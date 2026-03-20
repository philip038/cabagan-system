import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Events from './Events';
import Announcements from './Announcements';
import Login from './Login';

function App() {

  // ✅ ADMIN CHECK
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const logout = () => {
    localStorage.removeItem("isAdmin");
    window.location.reload();
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>

        {/* NAVBAR */}
        <nav style={{
          background: '#2c7be5',
          padding: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: 'white', margin: 0 }}>
            Cabagan LGU System
          </h2>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Home
            </Link>

            <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>
              Events
            </Link>

            <Link to="/announcements" style={{ color: 'white', textDecoration: 'none' }}>
              Announcements
            </Link>

            {/* ✅ ONLY SHOW LOGOUT IF ADMIN */}
            {isAdmin && (
              <button
                onClick={logout}
                style={{
                  background: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/announcements" element={<Announcements />} />

          {/* ✅ HIDDEN ADMIN ROUTE */}
          <Route path="/admin" element={<Login />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;