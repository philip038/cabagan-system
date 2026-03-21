import { useEffect, useState } from 'react';

const BARANGAYS = [ "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte","Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita","Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)","Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)","San Bernardo","San Juan","Saui","Tallag","Ugad","Union" ];

function Home() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [barangay, setBarangay] = useState(localStorage.getItem("barangay") || "");

  const API = "https://cabagan-backend.onrender.com";

  useEffect(() => {
    fetch(`${API}/events`).then(r=>r.json()).then(setEvents);
    fetch(`${API}/announcements`).then(r=>r.json()).then(setAnnouncements);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      <select
        value={barangay}
        onChange={(e)=>{
          setBarangay(e.target.value);
          localStorage.setItem("barangay", e.target.value);
        }}
      >
        <option value="">Select Barangay</option>
        {BARANGAYS.map(b => <option key={b}>{b}</option>)}
      </select>

      <h2>📢 Announcements</h2>
      {announcements
        .filter(a => a.barangay === "All" || a.barangay === barangay)
        .map(a => <p key={a.id}>{a.title}</p>)
      }

      <h2>🎉 Events</h2>
      {events
        .filter(e => e.barangay === "All" || e.barangay === barangay)
        .map(e => <p key={e.id}>{e.title}</p>)
      }
    </div>
  );
}

export default Home;