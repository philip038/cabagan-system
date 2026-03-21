import { useEffect, useState } from 'react';

const barangays = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [barangay, setBarangay] = useState('');

  // ================= FETCH =================
  useEffect(() => {
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));

    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  // ================= FILTER LOGIC =================
  const filteredAnnouncements = announcements.filter(a =>
    !barangay
      ? true
      : a.barangay === barangay || a.barangay === "All"
  );

  const filteredEvents = events.filter(e =>
    !barangay
      ? true
      : e.barangay === barangay || e.barangay === "All"
  );

  // ================= UI =================
  return (
    <div style={{
      padding: '20px',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1>📊 Dashboard</h1>

      {/* ===== Barangay Selector ===== */}
      <select
        value={barangay}
        onChange={(e) => setBarangay(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      >
        <option value="">Select Barangay</option>
        <option value="All">All Barangays</option>
        {barangays.map((b, i) => (
          <option key={i} value={b}>{b}</option>
        ))}
      </select>

      {/* ================= ANNOUNCEMENTS ================= */}
      <h2>📢 Announcements</h2>

      {filteredAnnouncements.length === 0 ? (
        <p>No announcements</p>
      ) : (
        filteredAnnouncements.map(a => (
          <div key={a.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{a.title}</h3>
            <p>{a.content}</p>

            {/* Barangay Tag */}
            <small style={{ color: '#888' }}>
              📍 {a.barangay || "All"}
            </small>
          </div>
        ))
      )}

      {/* ================= EVENTS ================= */}
      <h2 style={{ marginTop: '30px' }}>🎉 Events</h2>

      {filteredEvents.length === 0 ? (
        <p>No events</p>
      ) : (
        filteredEvents.map(e => (
          <div key={e.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>

            <small style={{ display: 'block', color: '#666' }}>
              📅 {e.event_date} | 📍 {e.location}
            </small>

            {/* Barangay Tag */}
            <small style={{ color: '#888' }}>
              📍 {e.barangay || "All"}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;