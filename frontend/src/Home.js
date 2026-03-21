import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://cabagan-backend.onrender.com";

const barangays = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan",
  "Casibarag Norte","Casibarag Sur","Catabayungan",
  "Centro (Poblacion)","Cubag","Garita","Luquilu",
  "Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto",
  "San Antonio (Candanum)","San Bernardo","San Juan",
  "Saui","Tallag","Ugad","Union"
];

function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const a = await axios.get(`${API}/announcements`);
      const e = await axios.get(`${API}/events`);
      setAnnouncements(a.data);
      setEvents(e.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SORT PINNED FIRST
  const sortPinned = (items) => {
    return [...items].sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });
  };

  // 🔥 FILTER + SORT
  const filteredAnnouncements = sortPinned(
    announcements.filter(a =>
      selectedBarangay === "" ||
      a.barangays.includes("All") ||
      a.barangays.includes(selectedBarangay)
    )
  );

  const filteredEvents = sortPinned(
    events.filter(e =>
      selectedBarangay === "" ||
      e.barangays.includes("All") ||
      e.barangays.includes(selectedBarangay)
    )
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* FILTER */}
      <select
        value={selectedBarangay}
        onChange={(e) => setSelectedBarangay(e.target.value)}
        style={styles.select}
      >
        <option value="">🌐 All Barangays</option>
        {barangays.map((b, i) => (
          <option key={i} value={b}>{b}</option>
        ))}
      </select>

      {/* ANNOUNCEMENTS */}
      <h2 style={styles.section}>📢 Announcements</h2>

      {filteredAnnouncements.length === 0 ? (
        <p style={styles.empty}>No announcements</p>
      ) : (
        filteredAnnouncements.map((a) => (
          <div key={a.id} style={styles.card}>
            <h3 style={styles.cardTitle}>
              {a.pinned && "📌 "} {a.title}
            </h3>
            <p style={styles.text}>{a.content}</p>
            <small style={styles.meta}>
              📍 {a.barangays.join(", ")}
            </small>
          </div>
        ))
      )}

      {/* EVENTS */}
      <h2 style={styles.section}>🎉 Events</h2>

      {filteredEvents.length === 0 ? (
        <p style={styles.empty}>No events</p>
      ) : (
        filteredEvents.map((e) => (
          <div key={e.id} style={styles.card}>
            <h3 style={styles.cardTitle}>
              {e.pinned && "📌 "} {e.title}
            </h3>
            <p style={styles.text}>{e.description}</p>
            <small style={styles.meta}>
              {e.date} • 📍 {e.barangays.join(", ")}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;

const styles = {
  page: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  select: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "300px"
  },
  section: {
    marginTop: "25px",
    marginBottom: "10px",
    fontSize: "20px"
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  cardTitle: {
    marginBottom: "5px"
  },
  text: {
    marginBottom: "8px"
  },
  meta: {
    color: "#777"
  },
  empty: {
    color: "#777"
  }
};