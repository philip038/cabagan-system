import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

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

  const addEvent = () => {
    fetch('https://cabagan-backend.onrender.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        event_date: date,
        location
      })
    })
      .then(res => res.json())
      .then(() => {
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
      method: 'DELETE'
    }).then(() => fetchData());
  };

  // 🔍 FILTER EVENTS
  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      padding: '20px',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Cabagan Events</h1>

      {/* 🔍 SEARCH BAR */}
      <input
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      {/* FORM */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>Add Event</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
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
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <button
          onClick={addEvent}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Add Event
        </button>
      </div>

      {/* LIST */}
      {filteredEvents.map(e => (
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
          <br /><br />

          <button
            onClick={() => deleteEvent(e.id)}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Events;