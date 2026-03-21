import { useEffect, useState } from 'react';

const API = "https://cabagan-backend.onrender.com";

function Events() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');

  const isAdmin = !!localStorage.getItem('token');

  const authHeader = {
    Authorization: localStorage.getItem('token')
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch(`${API}/events`)
      .then(res => res.json())
      .then(d => {
        const sorted = d.sort((a, b) => (b.pinned === true) - (a.pinned === true));
        setData(sorted);
      });
  };

  const add = async () => {
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
        barangays: ["All"]
      })
    });

    setTitle('');
    setDesc('');
    setDate('');
    fetchData();
  };

  const del = async (id) => {
    await fetch(`${API}/events/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });
    fetchData();
  };

  const pin = async (item) => {
    const count = data.filter(x => x.pinned).length;
    if (!item.pinned && count >= 10) return alert("Max 10 pinned");

    await fetch(`${API}/events/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ ...item, pinned: !item.pinned })
    });

    fetchData();
  };

  return (
    <div style={page}>
      <h1>🎉 Events</h1>

      {isAdmin && (
        <div style={card}>
          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={input} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="date" style={input} value={date} onChange={e => setDate(e.target.value)} />
          <button style={btn} onClick={add}>Add Event</button>
        </div>
      )}

      {data.map(item => (
        <div key={item.id} style={{ ...card, borderLeft: item.pinned ? "5px solid gold" : "none" }}>
          <h3>{item.pinned && "📌"} {item.title}</h3>
          <p>{item.description}</p>
          <small>{item.event_date}</small>

          {isAdmin && (
            <div>
              <button onClick={() => pin(item)}>📌</button>
              <button onClick={() => del(item.id)}>🗑</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const page = { padding: 20 };
const card = { background: "#fff", padding: 15, margin: 10 };
const input = { width: "100%", marginBottom: 10 };
const btn = { padding: 10 };

export default Events;