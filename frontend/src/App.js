import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Events from './Events';
import Announcements from './Announcements';


function App() {
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

  <div>
    <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
      Home
    </Link>
    <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>
      Events
    </Link>
    <Link to="/announcements" style={{ color: 'white', marginLeft: '20px', textDecoration: 'none' }}>
      Announcements
    </Link>
  </div>
</nav>

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

export default App;