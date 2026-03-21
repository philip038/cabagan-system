import { useEffect, useState } from 'react';

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [event_date, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [selectedBarangays, setSelectedBarangays] = useState([]);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const API = "https://cabagan-backend.onrender.com";

  const fetchEvents = () => {
    fetch(`${API}/events`)
      .then(res => res.json())
      .then(setEvents);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleBarangayChange = (e) => {
    const value = e.target.value;

    setSelectedBarangays(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  };

  const addEvent = async () => {
    if (!isAdmin) return alert("Unauthorized ❌");

    if (!title || !description || !event_date || !location) {
      return alert("Fill all fields");
    }

    const res = await fetch(`${API}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
      },
      body: JSON.stringify({
        title,
        description,
        event_date,
        location,
        barangays: selectedBarangays.length ? selectedBarangays : ["All"]
      })
    });

    if (res.status === 403) return alert("Not authorized ❌");

    alert("Event added ✅");

    setTitle('');
    setDescription('');
    setEventDate('');
    setLocation('');
    setSelectedBarangays([]);

    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!isAdmin) return;

    await fetch(`${API}/events/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': 'secret123' }
    });

    fetchEvents();
  };

  return (
    <div style={page}>
      <h1>🎉 Cabagan Events</h1>

      {isAdmin && (
        <div style={card}>
          <h3>Add Event</h3>

          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <input style={input} type="date" value={event_date} onChange={e => setEventDate(e.target.value)} />
          <input style={input} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />

          <h4>Select Barangays</h4>
          <div style={checkboxBox}>
            {barangaysList.map((b, i) => (
              <label key={i}>
                <input type="checkbox" value={b} onChange={handleBarangayChange} />
                {' '}{b}
              </label>
            ))}
          </div>

          <button style={primaryBtn} onClick={addEvent}>➕ Add Event</button>
        </div>
      )}

      {events.map(e => (
        <div key={e.id} style={card}>
          <div style={row}>
            <div>
              <h3>{e.title}</h3>
              <p>{e.description}</p>
              <small>📅 {e.event_date} | 📍 {e.location}</small><br />
              <small>📍 {(e.barangays || ["All"]).join(', ')}</small>
            </div>

            {isAdmin && (
              <button style={deleteBtn} onClick={() => deleteEvent(e.id)}>
                🗑
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* STYLES */
const page = { padding: '20px', background: '#f4f6f9', minHeight: '100vh' };
const card = { background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };
const input = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' };
const primaryBtn = { padding: '10px', background: '#2c7be5', color: 'white', border: 'none', borderRadius: '8px' };
const deleteBtn = { background: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' };
const checkboxBox = { maxHeight: '150px', overflowY: 'auto', marginBottom: '10px' };
const row = { display: 'flex', justifyContent: 'space-between' };

export default Events;
