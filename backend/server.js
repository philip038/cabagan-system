const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database
const db = new Database('database.db');

// Create tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    event_date TEXT,
    location TEXT
  )
`).run();

// Routes

// Announcements
app.get('/announcements', (req, res) => {
  const rows = db.prepare("SELECT * FROM announcements").all();
  res.json(rows);
});

app.post('/announcements', (req, res) => {
  const { title, content } = req.body;
  db.prepare(
    "INSERT INTO announcements (title, content) VALUES (?, ?)"
  ).run(title, content);
  res.send("Added");
});

// Events
app.get('/events', (req, res) => {
  const rows = db.prepare("SELECT * FROM events").all();
  res.json(rows);
});

app.post('/events', (req, res) => {
  const { title, description, event_date, location } = req.body;

  db.prepare(
    "INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)"
  ).run(title, description, event_date, location);

  res.send("Event added");
});

// Delete event
app.delete('/events/:id', (req, res) => {
  db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  res.send("Deleted");
});

// PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});