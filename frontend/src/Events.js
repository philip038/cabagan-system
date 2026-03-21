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
  const [all, setAll] = useState(true);
  const [selected, setSelected] = useState([]);

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const res = await fetch(`${API}/events`);
    const data = await res.json();

    const safe = data.map(e => ({
      ...e,
      barangays: e.barangays || [],
      pinned: e.pinned || false
    }));

    setEvents(safe.sort((a, b) => b.pinned - a.pinned));
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const addEvent = async () => {
    if (!title || !desc || !date) return alert("Fill all fields");

    await fetch(`${API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        title,
        description: desc,
        event_date: date,
        barangays: all ? ["All"] : selected
      })
    });

    setTitle(""); setDesc(""); setDate(""); setSelected([]); setAll(true);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });
    fetchEvents();
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
      <h1>🎉 Events</h1>

      {isAdmin && (
        <div style={card}>
          <input style={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={input} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="date" style={input} value={date} onChange={e => setDate(e.target.value)} />

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
        <div key={e.id} style={{ ...card, borderLeft: e.pinned ? "5px solid gold" : "" }}>
          <h3>{e.pinned && "📌"} {e.title}</h3>
          <p>{e.description}</p>
          <small>{e.event_date} • {Array.isArray(e.barangays) && e.barangays.length ? e.barangays.join(", ") : "All"}</small>

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

const page = { padding: 20, background: "#f5f7fa", minHeight: "100vh" };
const card = { background: "#fff", padding: 15, margin: 10, borderRadius: 10 };
const input = { width: "100%", marginBottom: 10 };
const btn = { padding: 10 };
const checkboxBox = { display: "flex", flexWrap: "wrap", gap: 10 };

export default Events;