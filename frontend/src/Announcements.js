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

  useEffect(() => {
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  }, []);

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

    if (!title || !content) {
      return alert("Fill all fields");
    }

    await fetch('https://cabagan-backend.onrender.com/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        barangays: selectedBarangays.length ? selectedBarangays : ["All"]
      })
    });

    window.location.reload();
  };

  const deleteAnnouncement = async (id) => {
    if (!isAdmin) return alert("Unauthorized ❌");

    await fetch(`https://cabagan-backend.onrender.com/announcements/${id}`, {
      method: 'DELETE'
    });

    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div style={{
      padding: '20px',
      background: '#f4f6f9',
      minHeight: '100vh'
    }}>
      <h1>📢 Cabagan Announcements</h1>

      {/* ================= ADMIN FORM ================= */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3>Add Announcement</h3>

          <input
            placeholder="Title"
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Content"
            onChange={e => setContent(e.target.value)}
            style={inputStyle}
          />

          <h4>Select Barangays</h4>

          <div style={{
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            {barangaysList.map((b, i) => (
              <label key={i} style={{ display: 'block' }}>
                <input type="checkbox" value={b} onChange={handleBarangayChange} />
                {' '}{b}
              </label>
            ))}
          </div>

          <button style={primaryBtn} onClick={addAnnouncement}>
            ➕ Add Announcement
          </button>
        </div>
      )}

      {/* ================= LIST ================= */}
      {announcements.length === 0 ? (
        <p>No announcements available</p>
      ) : (
        announcements.map(a => (
          <div key={a.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>{a.title}</h3>
                <p>{a.content}</p>

                <small style={{ color: '#888' }}>
                  📍 {(a.barangays || ["All"]).join(', ')}
                </small>
              </div>

              {/* ✅ DELETE BUTTON FIXED */}
              {isAdmin && (
                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  style={deleteBtn}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc'
};

const primaryBtn = {
  padding: '10px 15px',
  background: '#2c7be5',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

const deleteBtn = {
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  height: 'fit-content',
  cursor: 'pointer'
};

const cardStyle = {
  background: 'white',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

export default Announcements;