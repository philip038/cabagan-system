import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://cabagan-backend.onrender.com"; // change if needed

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [annRes, eventRes] = await Promise.all([
        axios.get(`${API}/announcements`),
        axios.get(`${API}/events`)
      ]);

      // ✅ FIX: Ensure barangays always array
      setAnnouncements(
        annRes.data.map(item => ({
          ...item,
          barangays: item.barangays || [],
          pinned: item.pinned || false
        }))
      );

      setEvents(
        eventRes.data.map(item => ({
          ...item,
          barangays: item.barangays || [],
          pinned: item.pinned || false
        }))
      );
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ FILTER LOGIC
  const filterByBarangay = (items) => {
    if (!selectedBarangay) return items;

    return items.filter(item =>
      item.barangays.length === 0 ||
      item.barangays.includes(selectedBarangay)
    );
  };

  // ✅ SORT PINNED FIRST
  const sortPinned = (items) => {
    return [...items].sort((a, b) => b.pinned - a.pinned);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* FILTER */}
      <select
        style={styles.select}
        value={selectedBarangay}
        onChange={(e) => setSelectedBarangay(e.target.value)}
      >
        <option value="">All Barangays</option>
        <option>Aggub</option>
        <option>Anao</option>
        <option>Angancasilian</option>
        <option>Balasig</option>
        <option>Cansan</option>
        <option>Centro (Poblacion)</option>
        {/* add more if needed */}
      </select>

      {/* ANNOUNCEMENTS */}
      <h2 style={styles.section}>📢 Announcements</h2>

      {sortPinned(filterByBarangay(announcements)).map(item => (
        <div key={item._id} style={styles.card}>
          {item.pinned && <span style={styles.pin}>📌</span>}
          <h3>{item.title}</h3>
          <p>{item.content}</p>

          <small style={styles.tag}>
            📍{" "}
            {Array.isArray(item.barangays) && item.barangays.length > 0
              ? item.barangays.join(", ")
              : "All"}
          </small>
        </div>
      ))}

      {/* EVENTS */}
      <h2 style={styles.section}>🎉 Events</h2>

      {sortPinned(filterByBarangay(events)).map(item => (
        <div key={item._id} style={styles.card}>
          {item.pinned && <span style={styles.pin}>📌</span>}
          <h3>{item.title}</h3>
          <p>{item.description}</p>

          <small style={styles.tag}>
            📅 {item.date}
          </small>

          <br />

          <small style={styles.tag}>
            📍{" "}
            {Array.isArray(item.barangays) && item.barangays.length > 0
              ? item.barangays.join(", ")
              : "All"}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Home;

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto"
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px"
  },
  section: {
    marginTop: "30px",
    marginBottom: "10px"
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    width: "100%"
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "relative"
  },
  pin: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "18px"
  },
  tag: {
    color: "#555"
  }
};