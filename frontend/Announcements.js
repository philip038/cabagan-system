import { useEffect, useState } from 'react';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');

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

  const addAnnouncement = () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    fetch('https://cabagan-backend.onrender.com/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(() => {
        setTitle('');
        setContent('');
        fetchData();
      });
  };

  // 🔍 SEARCH FILTER
  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      padding: '20px',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Cabagan Announcements</h1>

      {/* SEARCH */}
      <input
        placeholder="Search announcements..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      {/* FORM */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>Add Announcement</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <button
          onClick={addAnnouncement}
          style={{
            background: '#2c7be5',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Add Announcement
        </button>
      </div>

      {/* LIST */}
      {filteredAnnouncements.map(a => (
        <div key={a.id} style={{
          background: 'white',
          padding: '15px',
          marginBottom: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Announcements;