const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // ✅ allow image size

const DATA_FILE = './data.json';
const ADMIN_TOKEN = "secret123";

// 🔐 ADMIN CHECK
const checkAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ message: "Forbidden ❌" });
  }
  next();
};

// READ
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { announcements: [], events: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

// WRITE
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

//
// 📢 ANNOUNCEMENTS
//

app.get('/announcements', (req, res) => {
  const data = readData();
  res.json(data.announcements);
});

app.post('/announcements', checkAdmin, (req, res) => {
  const data = readData();

  const newItem = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    image: req.body.image || "" // ✅ NEW
  };

  data.announcements.push(newItem);
  writeData(data);

  res.json(newItem);
});

app.delete('/announcements/:id', checkAdmin, (req, res) => {
  const data = readData();
  data.announcements = data.announcements.filter(a => a.id != req.params.id);
  writeData(data);
  res.json({ message: "Deleted" });
});

//
// 🎉 EVENTS
//

app.get('/events', (req, res) => {
  const data = readData();
  res.json(data.events);
});

app.post('/events', checkAdmin, (req, res) => {
  const data = readData();

  const newEvent = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    location: req.body.location,
    image: req.body.image || "" // ✅ NEW
  };

  data.events.push(newEvent);
  writeData(data);

  res.json(newEvent);
});

app.delete('/events/:id', checkAdmin, (req, res) => {
  const data = readData();
  data.events = data.events.filter(e => e.id != req.params.id);
  writeData(data);
  res.json({ message: "Deleted" });
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));