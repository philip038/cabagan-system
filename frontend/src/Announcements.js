import { useEffect, useState } from "react";

const API = "https://cabagan-backend.onrender.com";

const barangaysList = [
  "Aggub","Anao","Angancasilian","Balasig","Cansan","Casibarag Norte",
  "Casibarag Sur","Catabayungan","Centro (Poblacion)","Cubag","Garita",
  "Luquilu","Mabangug","Magassi","Masipi East","Masipi West (Magallones)",
  "Ngarag","Pilig Abajo","Pilig Alto","San Antonio (Candanum)",
  "San Bernardo","San Juan","Saui","Tallag","Ugad","Union"
];

function Announcements() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [all, setAll] = useState(true);
  const [selected, setSelected] = useState([]);

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await fetch(`${API}/announcements`);
    const d = await res.json();

    const safe = d.map(a => ({
      ...a,
      barangays: a.barangays || [],
      pinned: a.pinned || false
    }));

    setData(safe.sort((a, b) => b.pinned - a.pinned));
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const add = async () => {
    if (!title || !content) return alert("Fill all fields");

    await fetch(`${API}/announcements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        title,
        content,
        barangays: all ? ["All"] : selected
      })
    });

    setTitle("");
    setContent("");
    setSelected([]);
    setAll(true);

    fetchData();
  };

  const del = async (id) => {
    await fetch(`${API}/announcements/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });
    fetchData();
  };

  const pin = async (item) => {
    const count = data.filter(a => a.pinned).length;
    if (!item.pinned && count >= 10) return alert("Max 10 pinned");

    await fetch(`${API}/announcements/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ ...item, pinned: !item.pinned })
    });

    fetchData();
  };

  return (
    <div style={page}>
      <h1>📢 Announcements</h1>

      {isAdmin && (
        <div style={card}>
          <h3>Add Announcement</h3>

          <input
            style={input}
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            style={input}
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <label style={{ fontWeight: "bold" }}>
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
                <label key={b} style={checkboxItem}>
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

          <button style={btn} onClick={add}>
            + Add Announcement
          </button>
        </div>
      )}

      {data.map(item => (
        <div
          key={item.id}
          style={{
            ...card,
            borderLeft: item.pinned ? "6px solid gold" : ""
          }}
        >
          <h3>{item.pinned && "📌"} {item.title}</h3>
          <p>{item.content}</p>

          <small>
            📍{" "}
            {Array.isArray(item.barangays) && item.barangays.length > 0
              ? item.barangays.join(", ")
              : "All"}
          </small>

          {isAdmin && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => pin(item)}>📌</button>
              <button onClick={() => del(item.id)}>🗑</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* STYLES */

const page = {
  padding: 20,
  background: "#f5f7fa",
  minHeight: "100vh"
};

const card = {
  background: "#fff",
  padding: 15,
  marginBottom: 15,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const btn = {
  marginTop: 10,
  padding: 10,
  background: "#2c7be5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const checkboxBox = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 10
};

const checkboxItem = {
  width: "200px"
};

export default Announcements;