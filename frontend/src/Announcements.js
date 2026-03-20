import { useEffect, useState } from 'react';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchData = () => {
    setLoading(true);
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 ADD ANNOUNCEMENT
  const addAnnouncement = () => {
    // ✅ VALIDATION
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
      body: JSON.stringify({ title, content })
    })
      .then(res => {
        if (res.status === 403) {
          alert("Unauthorized ❌");
          return;
        }
        return res.json();
      })
      .then(() => {
        alert("Announcement added successfully ✅");

        setTitle('');
        setContent('');
        fetchData();
      });
  };

  // 🔥 DELETE ANNOUNCEMENT
  const deleteAnnouncement = (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    fetch(`https://cabagan-backend.onrender.com/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': 'secret123'
      }
    })
      .then(res => {
        if (res.status === 403) {
          alert("Unauthorized ❌");
          return;
        }
        alert("Deleted successfully 🗑️");
        fetchData();
      });
  };

  return (
    <div style={{
      padding: '30px',
      background: '#f4f6f9',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px' }}>📢 Cabagan Announcements</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3>Add Announcement</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />

          <button
            onClick={addAnnouncement}
            style={{
              background: '#2c7be5',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Add Announcement
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading announcements...</p>}

      {/* EMPTY STATE */}
      {!loading && announcements.length === 0 && (
        <p>📭 No announcements available</p>
      )}

      {/* LIST */}
      {announcements.map(a => (
        <div key={a.id} style={{
          background: 'white',
          padding: '20px',
          marginBottom: '15px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>

          {isAdmin && (
            <button
              onClick={() => deleteAnnouncement(a.id)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Announcements;