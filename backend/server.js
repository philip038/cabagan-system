const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create database
const db = new sqlite3.Database('./database.db');

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT
    )
  `);
});

// TEST ROUTE
app.get('/', (req, res) => {
  res.send("Backend is working!");
});

// GET announcements
app.get('/announcements', (req, res) => {
  db.all("SELECT * FROM announcements", (err, rows) => {
    res.json(rows);
  });
});

// ADD announcement
app.post('/announcements', (req, res) => {
  const { title, content } = req.body;

  db.run(
    "INSERT INTO announcements (title, content) VALUES (?, ?)",
    [title, content],
    () => res.send("Added!")
  );
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
// CREATE events table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      event_date TEXT,
      location TEXT
    )
  `);
});

// GET events
app.get('/events', (req, res) => {
  db.all("SELECT * FROM events", (err, rows) => {
    res.json(rows);
  });
});

// ADD event
app.post('/events', (req, res) => {
  const { title, description, event_date, location } = req.body;

  db.run(
    "INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)",
    [title, description, event_date, location],
    () => res.send("Event added!")
  );
});

// DELETE event
app.delete('/events/:id', (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM events WHERE id = ?", [id], () => {
    res.send("Event deleted");
  });
});