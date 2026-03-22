import { useEffect, useState } from "react";

const API = "https://cabagan-backend.onrender.com";

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [all, setAll] = useState(true);
  const [selected, setSelected] = useState([]);

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/events`);
      const data = await res.json();

      setEvents(
        data.map(e => ({
          ...e,
          barangays: e.barangays || [],
          pinned: e.pinned || false
        })).sort((a, b) => b.pinned - a.pinned)
      );
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const addEvent = async () => {
    if (!title || !desc || !date) return alert("Complete fields");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("event_date", date);
    if (image) formData.append("image", image);
    formData.append("barangays", JSON.stringify(all ? ["All"] : selected));

    try {
      const res = await fetch(`${API}/events`, {
        method: "POST",
        headers: { Authorization: token || "" },
        body: formData
      });

      if (!res.ok) throw new Error("Add failed");

      const newEvent = await res.json();
      setEvents(prev => [newEvent, ...prev]);

      setTitle("");
      setDesc("");
      setDate("");
      setImage(null);
      setSelected([]);
      setAll(true);
    } catch (err) {
      alert("Failed to add event");
      console.error(err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: token || "" }
      });

      if (!res.ok) throw new Error("Delete failed");

      setEvents(prev => prev.filter(e => e._id !== id && e.id !== id));
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  const togglePin = async (item) => {
    const count = events.filter(e => e.pinned).length;
    if (!item.pinned && count >= 10) return alert("Max 10 pinned");

    try {
      const res = await fetch(`${API}/events/${item._id || item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || ""
        },
        body: JSON.stringify({ ...item, pinned: !item.pinned })
      });

      if (!res.ok) throw new Error("Pin failed");

      fetchEvents();
    } catch (err) {
      alert("Failed to update pin");
      console.error(err);
    }
  };

  return (
    <div style={page}>
      <h1 style={titleStyle}>🌾 Events</h1>

      {isAdmin && (
        <div style={formCard}>
          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={input} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="date" style={input} value={date} onChange={e => setDate(e.target.value)} />
          <input type="file" onChange={e => setImage(e.target.files[0])} />

          <label>
            <input
              type="checkbox"
              checked={all}
              onChange={() => {
                setAll(!all);
                setSelected([]);
              }}
            />
            🌐 All Barangays
          </label>

          {!all && (
            <div style={checkboxBox}>
              {barangaysList.map(b => (
                <label key={b}>
                  <input
                    type="checkbox"
                    checked={selected.includes(b)}
                    onChange={() => toggleSelect(b)}
                  />
                  {b}
                </label>
              ))}
            </div>
          )}

          <button style={btn} onClick={addEvent}>+ Add Event</button>
        </div>
      )}

      {events.map(e => (
        <div key={e._id || e.id} style={card}>
          <h3>{e.pinned && "📌"} {e.title}</h3>

          {e.image && (
            <img
              src={e.image}   // ✅ FIXED HERE
              alt=""
              style={img}
            />
          )}

          <p>{e.description}</p>

          <small>
            {e.event_date} • {e.barangays.length ? e.barangays.join(", ") : "All"}
          </small>

          {isAdmin && (
            <div style={{ marginTop: 10 }}>
              <button style={pinBtn} onClick={() => togglePin(e)}>📌 Pin</button>
              <button style={deleteBtn} onClick={() => deleteEvent(e._id || e.id)}>🗑 Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* 🌾 STYLES */
const page = { padding: 20, background: "#f1f8f5", minHeight: "100vh" };
const titleStyle = { color: "#2e7d32" };
const formCard = { background: "#fff", padding: 15, borderRadius: 12, marginBottom: 20 };
const card = { background: "#fff", padding: 15, borderRadius: 12, marginBottom: 15 };
const input = { width: "100%", padding: 10, marginBottom: 10 };
const checkboxBox = { display: "flex", flexWrap: "wrap", gap: 10 };
const img = { width: "100%", borderRadius: 10, marginTop: 10 };

const btn = {
  background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
  color: "#fff",
  padding: 10,
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};

const pinBtn = {
  background: "#fff8e1",
  padding: 6,
  borderRadius: 6,
  marginRight: 5
};

const deleteBtn = {
  background: "#ffebee",
  padding: 6,
  borderRadius: 6
};

export default Events;