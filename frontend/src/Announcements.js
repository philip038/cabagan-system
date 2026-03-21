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

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

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
    if (!isAdmin) return alert("Unauthorized ❌");
    if (!title || !content) return alert("Fill all fields");

    await fetch(`${API}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
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
      headers: { 'x-admin-token': 'secret123' }
    });
    fetchData();
  };

  const pin = async (item) => {
    const count = data.filter(x => x.pinned).length;

    if (!item.pinned && count >= 10) {
      return alert("Max 10 pinned announcements");
    }

    await fetch(`${API}/announcements/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
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

          <h4>Target Barangays</h4>

          <label style={bold}>
            <input
              type="checkbox"
              checked={all}
              onChange={() => {
                setAll(!all);
                setSelected([]);
              }}
            />
            🌐 All Barangays
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
                  {' '}{b}
                </label>
              ))}
            </div>
          )}

          <button style={primaryBtn} onClick={add}>➕ Add</button>
        </div>
      )}

      {data.map(item => (
        <div key={item.id} style={{
          ...card,
          borderLeft: item.pinned ? "6px solid gold" : "none"
        }}>
          <h3>{item.pinned && "📌"} {item.title}</h3>
          <p>{item.content}</p>
          <small>📍 {(item.barangays || ["All"]).join(', ')}</small>

          {isAdmin && (
            <div style={actions}>
              <button style={pinBtn} onClick={() => pin(item)}>
                {item.pinned ? "Unpin" : "Pin"}
              </button>
              <button style={deleteBtn} onClick={() => del(item.id)}>
                🗑
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* STYLES */
const page = { padding: 20, background: '#f4f6f9', minHeight: '100vh' };
const card = { background: '#fff', padding: 20, borderRadius: 12, marginBottom: 15 };
const input = { width: '100%', marginBottom: 10, padding: 10 };
const primaryBtn = { padding: 10, background: '#2c7be5', color: '#fff', border: 'none', borderRadius: 8 };
const deleteBtn = { background: '#e74c3c', color: '#fff', padding: 10, borderRadius: 8 };
const pinBtn = { background: '#f1c40f', padding: 10, borderRadius: 8 };
const checkboxBox = { maxHeight: 150, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)' };
const bold = { fontWeight: 'bold', display: 'block', marginBottom: 10 };
const actions = { display: 'flex', gap: 10, marginTop: 10 };

export default Announcements;
