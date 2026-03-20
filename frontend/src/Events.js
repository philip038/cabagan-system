import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [image, setImage] = useState('');
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchData = () => {
    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📸 Convert image
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  // ➕ Add event
  const addEvent = () => {
    if (!title || !description || !date || !location) {
      alert("Please fill all fields ❌");
      return;
    }

    fetch('https://cabagan-backend.onrender.com/events', {
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

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <h1>🎉 Cabagan Events</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br /><br />
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br /><br />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} /><br /><br />
          <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} /><br /><br />

          <input type="file" accept="image/*" onChange={handleImage} /><br /><br />

          <button onClick={addEvent}>Add Event</button>
        </div>
      )}

      {/* EVENTS LIST */}
      {[...events]
        .sort((a, b) => b.pinned - a.pinned)
        .map(e => (
          <div
            key={e.id}
            style={{
              background: 'white',
              padding: '20px',
              marginBottom: '15px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: e.pinned ? '2px solid gold' : 'none'
            }}
          >
            {e.pinned && <p>📌 Pinned</p>}

            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <small>{e.event_date} | {e.location}</small>

            {e.image && (
              <img
                src={e.image}
                alt={e.title}
                style={{ width: '100%', marginTop: '10px', borderRadius: '10px' }}
              />
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  fetch(`https://cabagan-backend.onrender.com/events/pin/${e.id}`, {
                    method: 'PUT',
                    headers: { 'x-admin-token': 'secret123' }
                  }).then(res => {
                    if (res.status === 400) {
                      alert("Max 10 pinned events ❌");
                      return;
                    }
                    fetchData();
                  });
                }}
                style={{ marginTop: '10px' }}
              >
                {e.pinned ? "Unpin" : "Pin"}
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

export default Events;