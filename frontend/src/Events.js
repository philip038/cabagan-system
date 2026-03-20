import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);

  // ✅ FIXED ADMIN CHECK (VERY IMPORTANT)
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  // Fetch events
  const fetchData = () => {
    fetch('https://cabagan-backend.onrender.com/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add event (ADMIN ONLY)
  const addEvent = () => {
    if (!isAdmin) {
      alert("Unauthorized ❌");
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
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
        fetchData();
      });
  };

  // Delete event (ADMIN ONLY)
  const deleteEvent = (id) => {
    if (!isAdmin) {
      alert("Unauthorized ❌");
      return;
    }

    if (!window.confirm("Delete this event?")) return;

    fetch(`https://cabagan-backend.onrender.com/events/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': 'secret123'
      }
    })
      .then(res => {
        if (res.status === 403) {
          alert("Unauthorized ❌");
          return;
        }
        fetchData();
      });
  };

  return (
    <div style={{
      padding: '20px',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1>Cabagan Events</h1>

      {/* ✅ ADMIN ONLY FORM */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Add Event</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', padding: '8px' }}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          />

          <button
            onClick={addEvent}
            style={{
              background: 'green',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Add Event
          </button>
        </div>
      )}

      {/* EVENTS LIST */}
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map(e => (
          <div key={e.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <small>{e.event_date} | {e.location}</small>

            {/* ✅ ADMIN ONLY DELETE */}
            {isAdmin && (
              <div>
                <button
                  onClick={() => deleteEvent(e.id)}
                  style={{
                    marginTop: '10px',
                    background: 'red',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px'
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Events;