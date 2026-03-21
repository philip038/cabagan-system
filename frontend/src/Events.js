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
      return alert("Please fill all fields");
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
    <div style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <h1>🎉 Cabagan Events</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h3>Add Event</h3>

          <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
          <br />
          <input placeholder="Description" onChange={e => setDescription(e.target.value)} />
          <br />
          <input type="date" onChange={e => setEventDate(e.target.value)} />
          <br />
          <input placeholder="Location" onChange={e => setLocation(e.target.value)} />

          <h4>Select Barangays:</h4>
          {barangaysList.map((b, i) => (
            <label key={i} style={{ display: 'block' }}>
              <input type="checkbox" value={b} onChange={handleBarangayChange} />
              {b}
            </label>
          ))}

          <button onClick={addEvent}>Add Event</button>
        </div>
      )}

      {/* DISPLAY */}
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map(e => (
          <div key={e.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px'
          }}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <small>{e.event_date} | {e.location}</small>
            <br />
            <small>📍 {(e.barangays || ["All"]).join(', ')}</small>

            {isAdmin && (
              <button
                onClick={() => deleteEvent(e.id)}
                style={{ marginTop: '10px', background: 'red', color: 'white' }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Events;