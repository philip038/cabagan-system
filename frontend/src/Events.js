import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);

  // 🔐 Check admin
  const isAdmin = localStorage.getItem("isAdmin");

  // Fetch events
  const fetchData = () => {
    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add event
  const addEvent = () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const event_date = document.getElementById('date').value;
    const location = document.getElementById('location').value;

    fetch('https://cabagan-backend.onrender.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, event_date, location })
    }).then(() => {
      fetchData();
    });
  };

  // Delete event
  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;

    fetch(`https://cabagan-backend.onrender.com/events/${id}`, {
      method: 'DELETE'
    }).then(() => {
      fetchData();
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cabagan Events</h1>

      {/* 🔐 ADMIN ONLY: ADD EVENT */}
      {isAdmin && (
        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '10px'
        }}>
          <h3>Add Event</h3>

          <input id="title" placeholder="Title" /><br /><br />
          <input id="description" placeholder="Description" /><br /><br />
          <input id="date" type="date" /><br /><br />
          <input id="location" placeholder="Location" /><br /><br />

          <button onClick={addEvent}>Add Event</button>
        </div>
      )}

      {/* EVENTS LIST */}
      {events.map(e => (
        <div key={e.id} style={{
          background: '#fff',
          padding: '15px',
          marginBottom: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} | {e.location}</small>

          {/* 🔐 ADMIN ONLY: DELETE */}
          {isAdmin && (
            <div>
              <br />
              <button
                style={{ background: 'red', color: 'white' }}
                onClick={() => deleteEvent(e.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Events;