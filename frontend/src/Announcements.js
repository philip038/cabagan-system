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
  const [image, setImage] = useState(null);
  const [all, setAll] = useState(true);
  const [selected, setSelected] = useState([]);

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(`${API}/announcements`);
    const d = await res.json();

    setData(
      d.map(a => ({
        ...a,
        barangays: a.barangays || [],
        pinned: a.pinned || false
      })).sort((a, b) => b.pinned - a.pinned)
    );
  };

  const toggleSelect = (b) => {
    setSelected(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const add = async () => {
    if (!title || !content) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("barangays", JSON.stringify(all ? ["All"] : selected));

    const res = await fetch(`${API}/announcements`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData
    });

    const newItem = await res.json();

    setData(prev => [newItem, ...prev]);

    setTitle("");
    setContent("");
    setImage(null);
    setSelected([]);
    setAll(true);
  };

  const del = async (id) => {
    await fetch(`${API}/announcements/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    setData(prev => prev.filter(a => a.id !== id));
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
      <h1 style={titleStyle}>🌿 Announcements</h1>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={formCard}>
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

          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
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

      {/* DISPLAY */}
      {data.map(item => (
        <div
          key={item.id}
          style={{
            ...card,
            borderLeft: item.pinned ? "6px solid #f9a825" : ""
          }}
        >
          <h3>{item.pinned && "📌"} {item.title}</h3>

          {/* IMAGE */}
          {item.image && (
            <img
              src={`${API}/uploads/${item.image}`}
              alt=""
              style={img}
            />
          )}

          <p>{item.content}</p>

          <small>
            📍{" "}
            {Array.isArray(item.barangays) && item.barangays.length > 0
              ? item.barangays.join(", ")
              : "All"}
          </small>

          {isAdmin && (
            <div style={{ marginTop: 10 }}>
              <button style={pinBtn} onClick={() => pin(item)}>
                📌 Pin
              </button>

              <button style={deleteBtn} onClick={() => del(item.id)}>
                🗑 Delete
              </button>
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
  background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10
};

const pinBtn = {
  background: "#fff8e1",
  color: "#f9a825",
  padding: "6px 10px",
  borderRadius: 6,
  marginRight: 8,
  border: "none",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ffebee",
  color: "#c62828",
  padding: "6px 10px",
  borderRadius: 6,
  border: "none",
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

const img = {
  width: "100%",
  borderRadius: 10,
  marginTop: 10
};

export default Announcements;