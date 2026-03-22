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
    const res = await fetch(`${API}/events`);
    const data = await res.json();

    setEvents(
      data.map(e => ({
        ...e,
        barangays: e.barangays || [],
        pinned: e.pinned || false
      })).sort((a, b) => b.pinned - a.pinned)
    );
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const addEvent = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("event_date", date);
    formData.append("image", image);
    formData.append("barangays", JSON.stringify(all ? ["All"] : selected));

    const res = await fetch(`${API}/events`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData
    });

    const newEvent = await res.json();

    setEvents(prev => [newEvent, ...prev]);
    setTitle(""); setDesc(""); setDate(""); setImage(null);
    setSelected([]); setAll(true);
  };

  const deleteEvent = async (id) => {
    await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const togglePin = async (item) => {
    const count = events.filter(e => e.pinned).length;
    if (!item.pinned && count >= 10) return alert("Max 10 pinned");

    await fetch(`${API}/events/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ ...item, pinned: !item.pinned })
    });

    fetchEvents();
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
            <input type="checkbox" checked={all} onChange={() => { setAll(!all); setSelected([]); }} />
            All Barangays
          </label>

          {!all && (
            <div style={checkboxBox}>
              {barangaysList.map(b => (
                <label key={b}>
                  <input type="checkbox" checked={selected.includes(b)} onChange={() => toggleSelect(b)} />
                  {b}
                </label>
              ))}
            </div>
          )}

          <button style={btn} onClick={addEvent}>+ Add Event</button>
        </div>
      )}

      {events.map(e => (
        <div key={e.id} style={{ ...card, borderLeft: e.pinned ? "6px solid #f9a825" : "" }}>
          <h3>{e.pinned && "📌"} {e.title}</h3>

          {e.image && (
            <img
              src={`${API}/uploads/${e.image}`}
              alt=""
              style={img}
            />
          )}

          <p>{e.description}</p>
          <small>{e.event_date} • {e.barangays.join(", ") || "All"}</small>

          {isAdmin && (
            <div>
              <button onClick={() => togglePin(e)}>📌</button>
              <button onClick={() => deleteEvent(e.id)}>🗑</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* 🌾 STYLES */

const page = {
  padding: 20,
  background: "#f1f8f5",
  minHeight: "100vh"
};

const titleStyle = {
  color: "#2e7d32"
};

const formCard = {
  background: "#ffffff",
  padding: 15,
  borderRadius: 12,
  marginBottom: 20
};

const card = {
  background: "#ffffff",
  padding: 15,
  borderRadius: 12,
  marginBottom: 15,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const btn = {
  background: "#2e7d32",
  color: "white",
  padding: 10,
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};

const checkboxBox = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10
};

const img = {
  width: "100%",
  borderRadius: 10,
  marginTop: 10
};

export default Events;