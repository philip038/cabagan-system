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

  useEffect(() => {
    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

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

    await fetch('https://cabagan-backend.onrender.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        event_date,
        location,
        barangays: selectedBarangays.length ? selectedBarangays : ["All"]
      })
    });

    window.location.reload();
  };

  const deleteEvent = async (id) => {
    if (!isAdmin) return alert("Unauthorized ❌");

    await fetch(`https://cabagan-backend.onrender.com/events/${id}`, {
      method: 'DELETE'
    });

    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div style={{
      padding: '20px',
      background: '#f4f6f9',
      minHeight: '100vh'
    }}>
      <h1>🎉 Cabagan Events</h1>

      {/* ================= ADMIN FORM ================= */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3>Add Event</h3>

          <input
            placeholder="Title"
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Description"
            onChange={e => setDescription(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            onChange={e => setEventDate(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Location"
            onChange={e => setLocation(e.target.value)}
            style={inputStyle}
          />

          <h4>Select Barangays</h4>

          <div style={{
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            {barangaysList.map((b, i) => (
              <label key={i} style={{ display: 'block' }}>
                <input type="checkbox" value={b} onChange={handleBarangayChange} />
                {' '}{b}
              </label>
            ))}
          </div>

          <button style={primaryBtn} onClick={addEvent}>
            ➕ Add Event
          </button>
        </div>
      )}

      {/* ================= EVENTS LIST ================= */}
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map(e => (
          <div key={e.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>{e.title}</h3>
                <p>{e.description}</p>

                <small style={{ color: '#555' }}>
                  📅 {e.event_date} | 📍 {e.location}
                </small>

                <br />

                <small style={{ color: '#888' }}>
                  📍 {(e.barangays || ["All"]).join(', ')}
                </small>
              </div>

              {/* ✅ DELETE BUTTON (NOW VISIBLE) */}
              {isAdmin && (
                <button
                  onClick={() => deleteEvent(e.id)}
                  style={deleteBtn}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc'
};

const primaryBtn = {
  padding: '10px 15px',
  background: '#2c7be5',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

const deleteBtn = {
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  height: 'fit-content',
  cursor: 'pointer'
};

const cardStyle = {
  background: 'white',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

export default Events;