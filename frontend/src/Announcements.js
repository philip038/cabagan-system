import { useEffect, useState } from 'react';

const BARANGAYS = [
  "All","Aggub","Anao","Angancasilian","Balasig","Cansan",
  "Casibarag Norte","Casibarag Sur","Catabayungan",
  "Centro (Poblacion)","Cubag","Garita","Luquilu",
  "Mabangug","Magassi","Masipi East",
  "Masipi West (Magallones)","Ngarag","Pilig Abajo",
  "Pilig Alto","San Antonio (Candanum)","San Bernardo",
  "San Juan","Saui","Tallag","Ugad","Union"
];

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [image, setImage] = useState('');
  const [barangay, setBarangay] = useState("All");

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const API = "https://cabagan-backend.onrender.com";

  const fetchData = () => {
    fetch(`${API}/announcements`)
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const addAnnouncement = () => {
    if (!title || !content) {
      alert("Fill all fields ❌");
      return;
    }

    fetch(`${API}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
      },
      body: JSON.stringify({ title, content, image, barangay })
    }).then(() => {
      alert("Added ✅");
      setTitle('');
      setContent('');
      setImage('');
      setBarangay("All");
      fetchData();
    });
  };

  const deleteAnnouncement = (id) => {
    if (!window.confirm("Delete this?")) return;

    fetch(`${API}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': 'secret123' }
    }).then(() => fetchData());
  };

  const togglePin = (id) => {
    fetch(`${API}/announcements/pin/${id}`, {
      method: 'PUT',
      headers: { 'x-admin-token': 'secret123' }
    }).then(res => {
      if (res.status === 400) {
        alert("Max 10 pinned ❌");
        return;
      }
      fetchData();
    });
  };

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <h1>📢 Cabagan Announcements</h1>

      {isAdmin && (
        <div style={card}>
          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={input} placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />

          <select style={input} value={barangay} onChange={(e)=>setBarangay(e.target.value)}>
            {BARANGAYS.map(b => (
              <option key={b} value={b}>
                {b === "All" ? "All Barangays" : b}
              </option>
            ))}
          </select>

          <input type="file" onChange={handleImage} /><br /><br />

          <button style={primaryBtn} onClick={addAnnouncement}>Add Announcement</button>
        </div>
      )}

      {[...announcements]
        .sort((a, b) => b.pinned - a.pinned)
        .map(a => (
          <div key={a.id} style={{
            ...card,
            border: a.pinned ? '2px solid gold' : 'none'
          }}>
            {a.pinned && <span style={{ color: 'gold' }}>📌 Pinned</span>}

            <h3>{a.title}</h3>
            <p>{a.content}</p>
            <small>{a.barangay}</small>

            {a.image && <img src={a.image} alt={a.title} style={img} />}

            {isAdmin && (
              <div style={{ marginTop: '10px' }}>
                <button style={pinBtn} onClick={() => togglePin(a.id)}>
                  {a.pinned ? "Unpin" : "Pin"}
                </button>

                <button style={deleteBtn} onClick={() => deleteAnnouncement(a.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

const card = {
  background: 'white',
  padding: '20px',
  marginBottom: '15px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

const input = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px'
};

const primaryBtn = {
  background: '#2c7be5',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '6px'
};

const pinBtn = {
  background: '#ffc107',
  padding: '8px',
  marginRight: '10px',
  border: 'none',
  borderRadius: '5px'
};

const deleteBtn = {
  background: '#dc3545',
  color: 'white',
  padding: '8px',
  border: 'none',
  borderRadius: '5px'
};

const img = {
  width: '100%',
  marginTop: '10px',
  borderRadius: '10px'
};

export default Announcements;