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
      alert("Fill all fields ❌");
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
      <h1>📢 Announcements</h1>

      {isAdmin && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br /><br />
          <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} /><br /><br />

          <input type="file" accept="image/*" onChange={handleImage} /><br /><br />

          <button onClick={addAnnouncement}>Add Announcement</button>
        </div>
      )}

      {announcements.map(a => (
        <div key={a.id} style={{ background: 'white', padding: '20px', marginBottom: '10px', borderRadius: '10px' }}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>

          {a.image && (
            <img
              src={a.image}
              alt={a.title}   // ✅ FIXED
              style={{ width: '100%', marginTop: '10px', borderRadius: '10px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Announcements;