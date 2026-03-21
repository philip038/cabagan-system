import { useEffect, useState } from 'react';

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Announcements() {
  const API = "https://cabagan-backend.onrender.com";

  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedBarangays, setSelectedBarangays] = useState([]);
  const [allBarangays, setAllBarangays] = useState(true); // ✅ default ALL

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    fetch(`${API}/announcements`)
      .then(res => res.json())
      .then(setAnnouncements);
  };

  const handleBarangayChange = (value) => {
    setSelectedBarangays(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  };

  const addAnnouncement = async () => {
    if (!isAdmin) return alert("Unauthorized ❌");

    if (!title || !content) {
      return alert("Fill all fields");
    }

    const payloadBarangays =
      allBarangays ? ["All"] :
      selectedBarangays.length > 0 ? selectedBarangays :
      ["All"];

    await fetch(`${API}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
      },
      body: JSON.stringify({
        title,
        content,
        barangays: payloadBarangays
      })
    });

    alert("Announcement added ✅");

    setTitle('');
    setContent('');
    setSelectedBarangays([]);
    setAllBarangays(true);

    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id) => {
    await fetch(`${API}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': 'secret123' }
    });

    fetchAnnouncements();
  };

  return (
    <div style={page}>
      <h1>📢 Cabagan Announcements</h1>

      {isAdmin && (
        <div style={card}>
          <h3>Add Announcement</h3>

          <input
            style={input}
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            style={input}
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          {/* ALL BARANGAYS */}
          <label style={bold}>
            <input
              type="checkbox"
              checked={allBarangays}
              onChange={() => {
                setAllBarangays(!allBarangays);
                setSelectedBarangays([]);
              }}
            />
            {' '}🌐 All Barangays
          </label>

          {/* SHOW ONLY WHEN NOT ALL */}
          {!allBarangays && (
            <div style={checkboxBox}>
              {barangaysList.map((b, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={selectedBarangays.includes(b)}
                    onChange={() => handleBarangayChange(b)}
                  />
                  {' '}{b}
                </label>
              ))}
            </div>
          )}

          <button style={primaryBtn} onClick={addAnnouncement}>
            ➕ Add Announcement
          </button>
        </div>
      )}

      {/* LIST */}
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
const deleteBtn = { background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '8px' };
const checkboxBox = { maxHeight: '150px', overflowY: 'auto', marginTop: '10px', marginBottom: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' };
const row = { display: 'flex', justifyContent: 'space-between' };
const bold = { fontWeight: 'bold', display: 'block', marginBottom: '10px' };

export default Announcements;