import { useEffect, useState } from 'react';

const API = "https://cabagan-backend.onrender.com";

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Announcements() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [all, setAll] = useState(true);
  const [selected, setSelected] = useState([]);

  const isAdmin = !!localStorage.getItem('token');

  const authHeader = {
    Authorization: localStorage.getItem('token')
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch(`${API}/announcements`)
      .then(res => res.json())
      .then(d => {
        const sorted = d.sort((a, b) => (b.pinned === true) - (a.pinned === true));
        setData(sorted);
      });
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b)
        ? prev.filter(x => x !== b)
        : [...prev, b]
    );
  };

  const add = async () => {
    await fetch(`${API}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({
        title,
        content,
        barangays: all ? ["All"] : selected
      })
    });

    setTitle('');
    setContent('');
    setSelected([]);
    setAll(true);
    fetchData();
  };

  const del = async (id) => {
    await fetch(`${API}/announcements/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });
    fetchData();
  };

  const pin = async (item) => {
    const count = data.filter(x => x.pinned).length;
    if (!item.pinned && count >= 10) return alert("Max 10 pinned");

    await fetch(`${API}/announcements/${item.id}`, {
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
      <h1>📢 Announcements</h1>

      {isAdmin && (
        <div style={card}>
          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={input} placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />

          <label>
            <input type="checkbox" checked={all} onChange={() => { setAll(!all); setSelected([]); }} />
            All Barangays
          </label>

          {!all && (
            <div style={checkboxBox}>
              {barangaysList.map((b, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={selected.includes(b)}
                    onChange={() => toggleSelect(b)}
                  />
                  {b}
                </label>
              ))}
            </div>
          )}

          <button style={btn} onClick={add}>Add</button>
        </div>
      )}

      {data.map(item => (
        <div key={item.id} style={{ ...card, borderLeft: item.pinned ? "5px solid gold" : "none" }}>
          <h3>{item.pinned && "📌"} {item.title}</h3>
          <p>{item.content}</p>
          <small>{(item.barangays || ["All"]).join(', ')}</small>

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
const checkboxBox = { maxHeight: 150, overflowY: 'auto' };

export default Announcements;