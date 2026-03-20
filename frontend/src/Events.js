import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchData = () => {
    setLoading(true);
    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addEvent = () => {
    // 🔴 VALIDATION
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
        location
      })
    })
      .then(res => {
        if (res.status === 403) {
          alert("Unauthorized ❌");
          return;
        }
        return res.json();
      })
      .then(() => {
        alert("Event added successfully ✅");

        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
        fetchData();
      });
  };

  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;

    fetch(`https://cabagan-backend.onrender.com/events/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': 'secret123'
      }
    }).then(() => {
      alert("Event deleted 🗑️");
      fetchData();
    });
  };

  return (
    <div style={{
      padding: '30px',
      background: '#f4f6f9',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px' }}>🎉 Cabagan Events</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3>Add Event</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px' }}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />

          <button
            onClick={addEvent}
            style={{
              background: '#2c7be5',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Add Event
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading events...</p>}

      {/* EMPTY STATE */}
      {!loading && events.length === 0 && (
        <p>📭 No events available</p>
      )}

      {/* LIST */}
      {events.map(e => (
        <div key={e.id} style={{
          background: 'white',
          padding: '20px',
          marginBottom: '15px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} | {e.location}</small>

          {isAdmin && (
            <button
              onClick={() => deleteEvent(e.id)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Events;