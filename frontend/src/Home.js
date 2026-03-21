import { useEffect, useState } from 'react';

const BARANGAYS = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan",
  "Casibarag Norte","Casibarag Sur","Catabayungan",
  "Centro (Poblacion)","Cubag","Garita","Luquilu",
  "Mabangug","Magassi","Masipi East",
  "Masipi West (Magallones)","Ngarag","Pilig Abajo",
  "Pilig Alto","San Antonio (Candanum)","San Bernardo",
  "San Juan","Saui","Tallag","Ugad","Union"
];

function Home() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [barangay, setBarangay] = useState(localStorage.getItem("barangay") || "");

  const API = "https://cabagan-backend.onrender.com";

  useEffect(() => {
    fetch(`${API}/events`).then(r => r.json()).then(setEvents);
    fetch(`${API}/announcements`).then(r => r.json()).then(setAnnouncements);
  }, []);

  const filteredAnnouncements = announcements.filter(
    a => a.barangay === "All" || a.barangay === barangay
  );

  const filteredEvents = events.filter(
    e => e.barangay === "All" || e.barangay === barangay
  );

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <h1>📊 Dashboard</h1>

      {/* Barangay Selector */}
      <select
        value={barangay}
        onChange={(e) => {
          setBarangay(e.target.value);
          localStorage.setItem("barangay", e.target.value);
        }}
        style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '6px'
        }}
      >
        <option value="">Select Barangay</option>
        {BARANGAYS.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {/* ANNOUNCEMENTS */}
      <h2>📢 Announcements</h2>

      {filteredAnnouncements.length === 0 ? (
        <p>No announcements</p>
      ) : (
        filteredAnnouncements.map(a => (
          <div key={a.id} style={card}>
            <h3>{a.title}</h3>
            <p>{a.content}</p>
            <small>{a.barangay}</small>

            {a.image && (
              <img src={a.image} alt={a.title} style={img} />
            )}
          </div>
        ))
      )}

      {/* EVENTS */}
      <h2 style={{ marginTop: '30px' }}>🎉 Events</h2>

      {filteredEvents.length === 0 ? (
        <p>No events</p>
      ) : (
        filteredEvents.map(e => (
          <div key={e.id} style={card}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <small>{e.event_date} | {e.location} | {e.barangay}</small>

            {e.image && (
              <img src={e.image} alt={e.title} style={img} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

const card = {
  background: 'white',
  padding: '20px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

const img = {
  width: '100%',
  marginTop: '10px',
  borderRadius: '10px'
};

export default Home;