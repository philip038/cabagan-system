import { useEffect, useState } from 'react';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  // 🔐 Admin check
  const isAdmin = localStorage.getItem("isAdmin");
  const token = isAdmin ? "secret123" : "";

  // Fetch data
  const fetchData = () => {
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add announcement
  const addAnnouncement = () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    fetch('https://cabagan-backend.onrender.com/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ title, content })
    })
    .then(res => {
      if (res.status === 403) {
        alert("Unauthorized! Please login as admin.");
        return;
      }
      return res.json();
    })
    .then(() => {
      fetchData();

      // Clear inputs
      document.getElementById('title').value = "";
      document.getElementById('content').value = "";
    });
  };

  // Delete announcement
  const deleteAnnouncement = (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    fetch(`https://cabagan-backend.onrender.com/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    })
    .then(res => {
      if (res.status === 403) {
        alert("Unauthorized! Please login as admin.");
        return;
      }
      return res.json();
    })
    .then(() => {
      fetchData();
    });
  };

  return (
    <div style={{
      padding: '20px',
      background: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <h1>Cabagan Announcements</h1>

      {/* 🔐 ADMIN ONLY: ADD */}
      {isAdmin && (
        <div style={{
          background: 'white',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Add Announcement</h3>

          <input id="title" placeholder="Title" /><br /><br />
          <textarea id="content" placeholder="Content" /><br /><br />

          <button onClick={addAnnouncement}>Add Announcement</button>
        </div>
      )}

      {/* LIST */}
      {announcements.length === 0 ? (
        <p>No announcements available</p>
      ) : (
        announcements.map(a => (
          <div key={a.id} style={{
            background: 'white',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{a.title}</h3>
            <p>{a.content}</p>

            {/* 🔐 ADMIN ONLY: DELETE */}
            {isAdmin && (
              <div>
                <br />
                <button
                  style={{ background: 'red', color: 'white' }}
                  onClick={() => deleteAnnouncement(a.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Announcements;