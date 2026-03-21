import { useEffect, useState } from 'react';

const API = "https://cabagan-backend.onrender.com";

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
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [all, setAll] = useState(true);
  const [selected, setSelected] = useState([]);

  const isAdmin = !!localStorage.getItem('token');

  const authHeader = {
    Authorization: localStorage.getItem('token')
  };

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = () => {
    fetch(`${API}/events`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => (b.pinned === true) - (a.pinned === true));
        setEvents(sorted);
      });
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b)
        ? prev.filter(x => x !== b)
        : [...prev, b]
    );
  };

  const addEvent = async () => {
    if (!title || !desc || !date) return alert("Fill all fields");

    await fetch(`${API}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({
        title,
        description: desc,
        event_date: date,
        barangays: all ? ["All"] : selected
      })
    });

    setTitle('');
    setDesc('');
    setDate('');
    setSelected([]);
    setAll(true);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await fetch(`${API}/events/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });
    fetchEvents();
  };

  const togglePin = async (item) => {
    const pinnedCount = events.filter(e => e.pinned).length;

    if (!item.pinned && pinnedCount >= 10) {
      return alert("Max 10 pinned events");
    }

    await fetch(`${API}/events/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({
        ...item,
        pinned: !item.pinned
      })
    });

    fetchEvents();
  };

  return (
    <div style={page}>
      <h1 style={titleStyle}>🎉 Events</h1>

      {isAdmin && (
        <div style={card}>
          <h3>Add Event</h3>

          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={input} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="date" style={input} value={date} onChange={e => setDate(e.target.value)} />

          <label style={{ fontWeight: 'bold' }}>
            <input type="checkbox" checked={all} onChange={() => { setAll(!all); setSelected([]); }} />
            🌐 All Barangays
          </label>

          {!all && (
            <div style={checkboxBox}>
              {barangaysList.map((b, i) => (
                <label key={i} style={checkboxItem}>
                  <input
                    type="checkbox"
                    checked={selected.includes(b)}
                    onChange={() => toggleSelect(b)}
                  />
                  {b}
                </label>
              ))}
            </div>
          )}

          <button style={addBtn} onClick={addEvent}>+ Add Event</button>
        </div>
      )}

      {events.length === 0 && <p>No events available</p>}

      {events.map(e => (
        <div key={e.id} style={{
          ...card,
          borderLeft: e.pinned ? "6px solid gold" : "none"
        }}>
          <h3>{e.pinned && "📌"} {e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} • {(e.barangays || ["All"]).join(', ')}</small>

          {isAdmin && (
            <div style={{ marginTop: 10 }}>
              <button style={pinBtn} onClick={() => togglePin(e)}>📌</button>
              <button style={deleteBtn} onClick={() => deleteEvent(e.id)}>🗑</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* STYLES */

const page = {
  padding: '20px',
  background: '#f5f7fa',
  minHeight: '100vh'
};

const titleStyle = {
  marginBottom: '20px'
};

const card = {
  background: 'white',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const input = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const checkboxBox = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px'
};

const checkboxItem = {
  width: '200px'
};

const addBtn = {
  marginTop: '10px',
  padding: '10px',
  background: '#2c7be5',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const deleteBtn = {
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  marginLeft: '10px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const pinBtn = {
  background: '#f1c40f',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default Events;