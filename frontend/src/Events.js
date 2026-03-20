import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [image, setImage] = useState('');
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const API = "https://cabagan-backend.onrender.com";

  const fetchData = () => {
    fetch(`${API}/events`)
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const addEvent = () => {
    if (!title || !description || !date || !location) {
      alert("Fill all fields ❌");
      return;
    }

    fetch(`${API}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
      },
      body: JSON.stringify({
        title,
        description,
        event_date: date,
        location,
        image
      })
    }).then(() => {
      alert("Event added ✅");
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setImage('');
      fetchData();
    });
  };

  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;

    fetch(`${API}/events/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': 'secret123' }
    }).then(() => fetchData());
  };

  const togglePin = (id) => {
    fetch(`${API}/events/pin/${id}`, {
      method: 'PUT',
      headers: { 'x-admin-token': 'secret123' }
    }).then(res => {
      if (res.status === 400) {
        alert("Max 10 pinned events ❌");
        return;
      }
      fetchData();
    });
  };

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <h1>🎉 Cabagan Events</h1>

      {isAdmin && (
        <div style={cardStyle}>
          <input style={inputStyle} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input style={inputStyle} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
          <input type="file" onChange={handleImage} />
          <br /><br />
          <button style={primaryBtn} onClick={addEvent}>Add Event</button>
        </div>
      )}

      {[...events].sort((a, b) => b.pinned - a.pinned).map(e => (
        <div key={e.id} style={{
          ...cardStyle,
          border: e.pinned ? '2px solid gold' : 'none'
        }}>
          {e.pinned && <span style={{ color: 'gold' }}>📌 Pinned</span>}

          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} | {e.location}</small>

          {e.image && (
            <img src={e.image} alt={e.title} style={imgStyle} />
          )}

          {isAdmin && (
            <div style={{ marginTop: '10px' }}>
              <button style={pinBtn} onClick={() => togglePin(e.id)}>
                {e.pinned ? "Unpin" : "Pin"}
              </button>

              <button style={deleteBtn} onClick={() => deleteEvent(e.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 🎨 STYLES
const cardStyle = {
  background: 'white',
  padding: '20px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px'
};

const primaryBtn = {
  background: '#2c7be5',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '6px'
};

const pinBtn = {
  background: '#ffc107',
  border: 'none',
  padding: '8px 12px',
  marginRight: '10px',
  borderRadius: '5px'
};

const deleteBtn = {
  background: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px'
};

const imgStyle = {
  width: '100%',
  marginTop: '10px',
  borderRadius: '10px'
};

export default Events;