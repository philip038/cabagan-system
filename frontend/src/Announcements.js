import { useEffect, useState } from 'react';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [image, setImage] = useState('');
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchData = () => {
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const addAnnouncement = () => {
    if (!title || !content) {
      alert("Please fill all fields ❌");
      return;
    }

    fetch('https://cabagan-backend.onrender.com/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'secret123'
      },
      body: JSON.stringify({
        title,
        content,
        image
      })
    }).then(() => {
      alert("Announcement added ✅");

      setTitle('');
      setContent('');
      setImage('');

      fetchData();
    });
  };

  return (
    <div style={{ padding: '30px', background: '#f4f6f9', minHeight: '100vh' }}>
      <h1>📢 Cabagan Announcements</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br /><br />
          <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} /><br /><br />

          <input type="file" accept="image/*" onChange={handleImage} /><br /><br />

          <button onClick={addAnnouncement}>Add Announcement</button>
        </div>
      )}

      {/* LIST */}
      {[...announcements]
        .sort((a, b) => b.pinned - a.pinned)
        .map(a => (
          <div
            key={a.id}
            style={{
              background: 'white',
              padding: '20px',
              marginBottom: '15px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: a.pinned ? '2px solid gold' : 'none'
            }}
          >
            {a.pinned && <p>📌 Pinned</p>}

            <h3>{a.title}</h3>
            <p>{a.content}</p>

            {a.image && (
              <img
                src={a.image}
                alt={a.title}
                style={{ width: '100%', marginTop: '10px', borderRadius: '10px' }}
              />
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  fetch(`https://cabagan-backend.onrender.com/announcements/pin/${a.id}`, {
                    method: 'PUT',
                    headers: { 'x-admin-token': 'secret123' }
                  }).then(res => {
                    if (res.status === 400) {
                      alert("Max 10 pinned announcements ❌");
                      return;
                    }
                    fetchData();
                  });
                }}
                style={{ marginTop: '10px' }}
              >
                {a.pinned ? "Unpin" : "Pin"}
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

export default Announcements;