import { useEffect, useState } from "react";

const API = "https://cabagan-backend.onrender.com";

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [aRes, eRes] = await Promise.all([
      fetch(`${API}/announcements`),
      fetch(`${API}/events`)
    ]);

    const aData = await aRes.json();
    const eData = await eRes.json();

    setAnnouncements(
      aData.map(a => ({
        ...a,
        barangays: a.barangays || [],
        pinned: a.pinned || false
      }))
    );

    setEvents(
      eData.map(e => ({
        ...e,
        barangays: e.barangays || [],
        pinned: e.pinned || false
      }))
    );
  };

  // 🔥 FILTER LOGIC
  const filterData = (items) => {
    if (!selectedBarangay) return items;

    return items.filter(item =>
      item.barangays.length === 0 ||
      item.barangays.includes("All") ||
      item.barangays.includes(selectedBarangay)
    );
  };

  // 🔥 PIN FIRST
  const sortPinned = (items) => {
    return [...items].sort((a, b) => b.pinned - a.pinned);
  };

  return (
    <div style={page}>
      <h1 style={title}>🌾 Cabagan LGU Dashboard</h1>

      {/* 📍 FILTER */}
      <select
        value={selectedBarangay}
        onChange={(e) => setSelectedBarangay(e.target.value)}
        style={select}
      >
        <option value="">🌐 All Barangays</option>
        {barangaysList.map(b => (
          <option key={b}>{b}</option>
        ))}
      </select>

      {/* 📢 ANNOUNCEMENTS */}
      <h2 style={section}>📢 Announcements</h2>
      {sortPinned(filterData(announcements)).map(a => (
        <div key={a.id} style={card}>
          <h3>{a.pinned && "📌 "} {a.title}</h3>

          {a.image && (
            <img src={`${API}/uploads/${a.image}`} alt="" style={img} />
          )}

          <p>{a.content}</p>

          <small>
            📍 {a.barangays.length ? a.barangays.join(", ") : "All"}
          </small>
        </div>
      ))}

      {/* 🎉 EVENTS */}
      <h2 style={section}>🎉 Events</h2>
      {sortPinned(filterData(events)).map(e => (
        <div key={e.id} style={card}>
          <h3>{e.pinned && "📌 "} {e.title}</h3>

          {e.image && (
            <img src={`${API}/uploads/${e.image}`} alt="" style={img} />
          )}

          <p>{e.description}</p>

          <small>
            {e.event_date} • {e.barangays.length ? e.barangays.join(", ") : "All"}
          </small>
        </div>
      ))}
    </div>
  );
}

/* 🌾 STYLES */
const page = { padding: 20, background: "#f1f8f5", minHeight: "100vh" };
const title = { color: "#2e7d32" };
const section = { marginTop: 30 };
const select = {
  padding: 10,
  borderRadius: 8,
  marginBottom: 20,
  width: "100%"
};
const card = {
  background: "#fff",
  padding: 15,
  marginBottom: 15,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};
const img = {
  width: "100%",
  borderRadius: 10,
  margin: "10px 0"
};

export default Home;
