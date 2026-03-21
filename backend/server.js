const express = require('express');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';
const SECRET = "cabagan-secret-key";

// 👤 ADMIN CREDENTIAL (change later)
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
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

//
// 🔐 VERIFY TOKEN
//
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ message: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

//
// 📢 ANNOUNCEMENTS
//
app.get('/announcements', (req, res) => {
  res.json(readData().announcements);
});

app.post('/announcements', verifyToken, (req, res) => {
  const data = readData();

  const newItem = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    barangays: req.body.barangays || ["All"],
    pinned: false
  };

  data.announcements.push(newItem);
  writeData(data);

  res.json(newItem);
});

app.put('/announcements/:id', verifyToken, (req, res) => {
  const data = readData();

  data.announcements = data.announcements.map(a =>
    a.id == req.params.id ? { ...a, ...req.body } : a
  );

  writeData(data);
  res.json({ message: "Updated" });
});

app.delete('/announcements/:id', verifyToken, (req, res) => {
  const data = readData();

  data.announcements = data.announcements.filter(
    a => a.id != req.params.id
  );

  writeData(data);
  res.json({ message: "Deleted" });
});

//
// 🎉 EVENTS
//
app.get('/events', (req, res) => {
  res.json(readData().events);
});

app.post('/events', verifyToken, (req, res) => {
  const data = readData();

  const newEvent = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    barangays: req.body.barangays || ["All"],
    pinned: false
  };

  data.events.push(newEvent);
  writeData(data);

  res.json(newEvent);
});

app.put('/events/:id', verifyToken, (req, res) => {
  const data = readData();

  data.events = data.events.map(e =>
    e.id == req.params.id ? { ...e, ...req.body } : e
  );

  writeData(data);
  res.json({ message: "Updated" });
});

app.delete('/events/:id', verifyToken, (req, res) => {
  const data = readData();

  data.events = data.events.filter(
    e => e.id != req.params.id
  );

  writeData(data);
  res.json({ message: "Deleted" });
});

//
// 🚀 START
//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));