import { useEffect, useState } from 'react';

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedBarangays, setSelectedBarangays] = useState([]);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const API = "https://cabagan-backend.onrender.com";

  const fetchData = () => {
    fetch(`${API}/announcements`)
      .then(res => res.json())
      .then(setAnnouncements);
  };

  useEffect(() => { fetchData(); }, []);

  const handleBarangayChange = (e) => {
    const value = e.target.value;

    setSelectedBarangays(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  };

  const addAnnouncement = async () => {
    if (!isAdmin) return alert("Unauthorized ❌");

    if (!title || !content) return alert("Fill all fields");

    const res = await fetch(`${API}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
      },
      body: JSON.stringify({
        title,
        content,
        barangays: selectedBarangays.length ? selectedBarangays : ["All"]
      })
    });

    if (res.status === 403) return alert("Not authorized ❌");

    alert("Added ✅");

    setTitle('');
    setContent('');
    setSelectedBarangays([]);

    fetchData();
  };

  const deleteAnnouncement = async (id) => {
    if (!isAdmin) return;

    await fetch(`${API}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': 'secret123' }
    });

    fetchData();
  };

  return (
    <div style={page}>
      <h1>📢 Announcements</h1>

      {isAdmin && (
        <div style={card}>
          <h3>Add Announcement</h3>

          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={input} placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />

          <h4>Select Barangays</h4>
          <div style={checkboxBox}>
            {barangaysList.map((b, i) => (
              <label key={i}>
                <input type="checkbox" value={b} onChange={handleBarangayChange} />
                {' '}{b}
              </label>
            ))}
          </div>

          <button style={primaryBtn} onClick={addAnnouncement}>➕ Add</button>
        </div>
      )}

      {announcements.map(a => (
        <div key={a.id} style={card}>
          <div style={row}>
            <div>
              <h3>{a.title}</h3>
              <p>{a.content}</p>
              <small>📍 {(a.barangays || ["All"]).join(', ')}</small>
            </div>

            {isAdmin && (
              <button style={deleteBtn} onClick={() => deleteAnnouncement(a.id)}>
                🗑
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* STYLES */
const page = { padding: '20px', background: '#f4f6f9', minHeight: '100vh' };
const card = { background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };
const input = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' };
const primaryBtn = { padding: '10px', background: '#2c7be5', color: 'white', border: 'none', borderRadius: '8px' };
const deleteBtn = { background: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '8px' };
const checkboxBox = { maxHeight: '150px', overflowY: 'auto', marginBottom: '10px' };
const row = { display: 'flex', justifyContent: 'space-between' };

export default Announcements;