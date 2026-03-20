const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const DATA_FILE = './data.json';

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    announcements: [],
    events: []
  }));
}

// Read data safely
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    return { announcements: [], events: [] };
  }
};

// Write data safely
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Write error:", error);
  }
};

// ROOT ROUTE (so no more "Cannot GET /")
app.get('/', (req, res) => {
  res.send("Cabagan Backend API is running");
});

// =======================
// ANNOUNCEMENTS
// =======================
app.get('/announcements', (req, res) => {
  const data = readData();
  res.json(data.announcements);
});

app.post('/announcements', (req, res) => {
  const data = readData();

  const newItem = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };

  data.announcements.push(newItem);
  writeData(data);

  res.json({ message: "Announcement added", data: newItem });
});

// =======================
// EVENTS
// =======================
app.get('/events', (req, res) => {
  const data = readData();
  res.json(data.events);
});

app.post('/events', (req, res) => {
  const data = readData();

  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newEvent = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    location: req.body.location
  };

  data.events.push(newEvent);
  writeData(data);

  res.json({ message: "Event added", data: newEvent });
});

// DELETE EVENT
app.delete('/events/:id', (req, res) => {
  const data = readData();

  data.events = data.events.filter(e => e.id != req.params.id);

  writeData(data);

  res.json({ message: "Event deleted" });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server, running, on port", PORT);
});