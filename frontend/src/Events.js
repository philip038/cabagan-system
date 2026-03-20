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

  // 📸 convert image
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const addEvent = () => {
    if (!title || !description || !date || !location) {
      alert("Fill all fields ❌");
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
      <h1>🎉 Events</h1>

      {isAdmin && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br /><br />
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br /><br />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} /><br /><br />
          <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} /><br /><br />

          <input type="file" accept="image/*" onChange={handleImage} /><br /><br />

          <button onClick={addEvent}>Add Event</button>
        </div>
      )}

      {events.map(e => (
        <div key={e.id} style={{ background: 'white', padding: '20px', marginBottom: '10px', borderRadius: '10px' }}>
          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} | {e.location}</small>

          {e.image && (
            <img
              src={e.image}
              alt={e.title}   // ✅ FIXED
              style={{ width: '100%', marginTop: '10px', borderRadius: '10px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Events;