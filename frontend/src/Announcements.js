import { useEffect, useState } from 'react';

const barangaysList = [ /* SAME LIST */ ];

function Announcements() {
  const API = "https://cabagan-backend.onrender.com";

  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedBarangays, setSelectedBarangays] = useState([]);
  const [allBarangays, setAllBarangays] = useState(false);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = () => {
    fetch(`${API}/announcements`)
      .then(res => res.json())
      .then(setAnnouncements);
  };

  const handleBarangayChange = (value) => {
    if (allBarangays) return;

    setSelectedBarangays(prev =>
      prev.includes(value)
        ? prev.filter(b => b !== value)
        : [...prev, value]
    );
  };

  const addAnnouncement = async () => {
    if (!isAdmin) return alert("Unauthorized ❌");

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

    alert("Added ✅");

    setTitle('');
    setContent('');
    setSelectedBarangays([]);
    setAllBarangays(false);

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
          <input style={input} placeholder="Title"
            value={title} onChange={e => setTitle(e.target.value)} />

          <textarea style={input} placeholder="Content"
            value={content} onChange={e => setContent(e.target.value)} />

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

          <div style={checkboxBox}>
            {barangaysList.map((b, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  checked={selectedBarangays.includes(b)}
                  disabled={allBarangays}
                  onChange={() => handleBarangayChange(b)}
                />
                {' '}{b}
              </label>
            ))}
          </div>

          <button style={primaryBtn} onClick={addAnnouncement}>
            ➕ Add
          </button>
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

/* reuse styles same as Events */

export default Announcements;