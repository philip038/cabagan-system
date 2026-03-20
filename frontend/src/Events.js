import { useEffect, useState } from 'react';

function Events() {
  const [events, setEvents] = useState([]);

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

  return (
    <div style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      <h1>Cabagan Events</h1>

      {/* FORM */}
      <div style={{
        background: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '10px'
      }}>
        <h3>Add Event</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        /><br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        /><br /><br />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        /><br /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        /><br /><br />

        <button onClick={addEvent}>Add Event</button>
      </div>

      {/* LIST */}
      {events.map(e => (
        <div key={e.id} style={{
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '8px'
        }}>
          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} | {e.location}</small><br />

          <button onClick={() => deleteEvent(e.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Events;