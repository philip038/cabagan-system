const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

// 🔐 simple in-memory session store
let sessions = {};

// ADMIN CREDENTIAL
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

//
// 📂 HELPERS
//
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { announcements: [], events: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

//
// 🔐 LOGIN
//
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(16).toString('hex');
    sessions[token] = true;

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials ❌" });
});

//
// 🔐 AUTH MIDDLEWARE
//
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !sessions[token]) {
    return res.status(403).json({ message: "Unauthorized ❌" });
  }

  next();
};

//
// ==========================
// 📢 ANNOUNCEMENTS
// ==========================
//

app.get('/announcements', (req, res) => {
  res.json(readData().announcements);
});

app.post('/announcements', checkAuth, (req, res) => {
  const data = readData();
  const { title, content, barangays } = req.body;

  const newItem = {
    id: Date.now(),
    title,
    content,
    pinned: false,
    barangays: barangays?.length ? barangays : ["All"]
  };

  data.announcements.push(newItem);
  writeData(data);

  res.json(newItem);
});

app.put('/announcements/:id', checkAuth, (req, res) => {
  const data = readData();
  const id = req.params.id;

  data.announcements = data.announcements.map(a =>
    a.id == id ? { ...a, ...req.body, id: a.id } : a
  );

  writeData(data);
  res.json({ message: "Updated" });
});

app.delete('/announcements/:id', checkAuth, (req, res) => {
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

app.get('/events', (req, res) => {
  res.json(readData().events);
});

app.post('/events', checkAuth, (req, res) => {
  const data = readData();
  const { title, description, event_date, barangays } = req.body;

  const newEvent = {
    id: Date.now(),
    title,
    description,
    event_date,
    pinned: false,
    barangays: barangays?.length ? barangays : ["All"]
  };

  data.events.push(newEvent);
  writeData(data);

  res.json(newEvent);
});

app.put('/events/:id', checkAuth, (req, res) => {
  const data = readData();
  const id = req.params.id;

  data.events = data.events.map(e =>
    e.id == id ? { ...e, ...req.body, id: e.id } : e
  );

  writeData(data);
  res.json({ message: "Updated" });
});

app.delete('/events/:id', checkAuth, (req, res) => {
  const data = readData();

  data.events = data.events.filter(
    e => e.id != req.params.id
  );

  writeData(data);
  res.json({ message: "Deleted" });
});

//
// 🚀 SERVER
//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));