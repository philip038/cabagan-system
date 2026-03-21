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

  // ✅ HANDLE MULTI SELECT
  const handleBarangayChange = (e) => {
    const value = e.target.value;

    setSelectedBarangays(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  };

  // ✅ ADD ANNOUNCEMENT
  const addAnnouncement = async () => {
    if (!isAdmin) return alert("Unauthorized ❌");
    if (!title || !content) return alert("Fill all fields");

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>📢 Announcements</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={{ marginBottom: '20px' }}>
          <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Content" onChange={e => setContent(e.target.value)} />

          <h4>Select Barangays:</h4>
          {barangaysList.map((b, i) => (
            <label key={i} style={{ display: 'block' }}>
              <input
                type="checkbox"
                value={b}
                onChange={handleBarangayChange}
              />
              {b}
            </label>
          ))}

          <button onClick={addAnnouncement}>Add Announcement</button>
        </div>
      )}

      {/* DISPLAY */}
      {announcements.map(a => (
        <div key={a.id} style={{ marginBottom: '10px' }}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>
          <small>📍 {a.barangays?.join(', ') || 'All'}</small>
        </div>
      ))}
    </div>
  );
}

export default Announcements;