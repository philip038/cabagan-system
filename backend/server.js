const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';
const ADMIN_TOKEN = "secret123";

//
// 🔐 ADMIN CHECK
//
const checkAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ message: "Forbidden ❌" });
  }
  next();
};

//
// 📂 READ DATA
//
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { announcements: [], events: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

//
// 💾 WRITE DATA
//
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

//
// ==========================
// 📢 ANNOUNCEMENTS
// ==========================
//

// GET
app.get('/announcements', (req, res) => {
  res.json(readData().announcements);
});

// CREATE
app.post('/announcements', checkAdmin, (req, res) => {
  const data = readData();
  const { title, content, barangays } = req.body;

  const newItem = {
    id: Date.now(),
    title,
    content,
    pinned: false,
    barangays:
      Array.isArray(barangays) && barangays.length > 0
        ? barangays
        : ["All"]
  };

  data.announcements.push(newItem);
  writeData(data);

  res.json(newItem);
});

// UPDATE (PIN / EDIT SAFE)
app.put('/announcements/:id', checkAdmin, (req, res) => {
  const data = readData();
  const id = req.params.id;

  data.announcements = data.announcements.map(a => {
    if (a.id == id) {
      return {
        ...a,               // keep existing data
        ...req.body,        // update fields
        id: a.id            // 🔒 prevent id overwrite
      };
    }
    return a;
  });

  writeData(data);
  res.json({ message: "Updated" });
});

// DELETE
app.delete('/announcements/:id', checkAdmin, (req, res) => {
  const data = readData();

  data.announcements = data.announcements.filter(
    a => a.id != req.params.id
  );

  writeData(data);
  res.json({ message: "Deleted" });
});

//
// ==========================
// 🎉 EVENTS
// ==========================
//

// GET
app.get('/events', (req, res) => {
  res.json(readData().events);
});

// CREATE
app.post('/events', checkAdmin, (req, res) => {
  const data = readData();
  const { title, description, event_date, barangays } = req.body;

  const newEvent = {
    id: Date.now(),
    title,
    description,
    event_date,
    pinned: false,
    barangays:
      Array.isArray(barangays) && barangays.length > 0
        ? barangays
        : ["All"]
  };

  data.events.push(newEvent);
  writeData(data);

  res.json(newEvent);
});

// UPDATE (PIN SAFE)
app.put('/events/:id', checkAdmin, (req, res) => {
  const data = readData();
  const id = req.params.id;

  data.events = data.events.map(e => {
    if (e.id == id) {
      return {
        ...e,
        ...req.body,
        id: e.id // 🔒 protect id
      };
    }
    return e;
  });

  writeData(data);
  res.json({ message: "Updated" });
});

// DELETE
app.delete('/events/:id', checkAdmin, (req, res) => {
  const data = readData();

  data.events = data.events.filter(
    e => e.id != req.params.id
  );

  writeData(data);
  res.json({ message: "Deleted" });
});

//
// ==========================
// 🚀 SERVER
// ==========================
//

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});