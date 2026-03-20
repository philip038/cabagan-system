import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);

  // 🔐 Check admin
  const isAdmin = localStorage.getItem("isAdmin");
  const token = isAdmin ? "secret123" : "";

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

    if (!title || !description || !event_date || !location) {
      alert("Please fill all fields");
      return;
    }

    fetch('https://cabagan-backend.onrender.com/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ title, description, event_date, location })
    })
    .then(res => {
      if (res.status === 403) {
        alert("Unauthorized! Please login as admin.");
        return;
      }
      return res.json();
    })
    .then(() => {
      fetchData();

      // Clear inputs
      document.getElementById('title').value = "";
      document.getElementById('description').value = "";
      document.getElementById('date').value = "";
      document.getElementById('location').value = "";
    });
  };

  // Delete event
  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;

    fetch(`https://cabagan-backend.onrender.com/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    })
    .then(res => {
      if (res.status === 403) {
        alert("Unauthorized! Please login as admin.");
        return;
      }
      return res.json();
    })
    .then(() => {
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

      {/* 🔐 ADMIN ONLY: ADD EVENT */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
        ))
      )}
    </div>
  );
}

export default Events;