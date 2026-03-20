const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

// Read data
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { events: [], announcements: [] };
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// Write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ================= ANNOUNCEMENTS =================

// GET
app.get('/announcements', (req, res) => {
  const data = readData();
  res.json(data.announcements || []);
});

// POST
app.post('/announcements', (req, res) => {
  const data = readData();

  const newItem = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };

  data.announcements.push(newItem);
  writeData(data);

  res.json(newItem);
});

// ✅ DELETE ANNOUNCEMENT (NEW)
app.delete('/announcements/:id', (req, res) => {
  const data = readData();

  data.announcements = data.announcements.filter(
    a => a.id != req.params.id
  );

  writeData(data);

  res.json({ message: "Deleted" });
});

// ================= EVENTS =================

// GET
app.get('/events', (req, res) => {
  const data = readData();
  res.json(data.events || []);
});

// POST
app.post('/events', (req, res) => {
  const data = readData();

  const newEvent = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    location: req.body.location
  };

  data.events.push(newEvent);
  writeData(data);

  res.json(newEvent);
});

// DELETE
app.delete('/events/:id', (req, res) => {
  const data = readData();

  data.events = data.events.filter(e => e.id != req.params.id);

  writeData(data);

  res.json({ message: "Deleted" });
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
