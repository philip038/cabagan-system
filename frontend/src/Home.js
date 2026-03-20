import { useEffect, useState } from 'react';

function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch announcements
  const fetchAnnouncements = () => {
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  };

  // Fetch events
  const fetchEvents = () => {
    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  return (
    <div style={{
      padding: '20px',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Cabagan Dashboard</h1>

      {/* ================= ANNOUNCEMENTS ================= */}
      <h2>📢 Announcements</h2>

      {announcements.length === 0 ? (
        <p>No announcements available</p>
      ) : (
        announcements.map(a => (
          <div key={a.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{a.title}</h3>
            <p>{a.content}</p>
          </div>
        ))
      )}

      {/* ================= EVENTS ================= */}
      <h2 style={{ marginTop: '30px' }}>🎉 Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map(e => (
          <div key={e.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <small>{e.event_date} | {e.location}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;