import { useEffect, useState } from 'react';

function Home() {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements
  const fetchData = () => {
    fetch('https://cabagan-backend.onrender.com/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  };

  // Load on start
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f5f7fa', minHeight: '100vh' }}>
      
      <h1>Cabagan Announcements</h1>

      {/* LIST */}
      {announcements.map(item => (
        <div key={item.id} style={{
          background: 'white',
          padding: '15px',
          marginBottom: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      ))}

    </div>
  );
}

export default Home;