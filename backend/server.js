require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "cabagan-secret-key";

// ==========================
// 🔗 MONGODB CONNECTION
// ==========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ==========================
// 📦 SCHEMAS
// ==========================
const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  barangays: [String],
  image: String,
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  event_date: String,
  barangays: [String],
  image: String,
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);
const Event = mongoose.model('Event', eventSchema);

// ==========================
// 📁 IMAGE UPLOAD
// ==========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    const fs = require('fs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ==========================
// 🔐 AUTH
// ==========================
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

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

// ==========================
// 📢 ANNOUNCEMENTS
// ==========================
app.get('/announcements', async (req, res) => {
  const data = await Announcement.find().sort({ pinned: -1, createdAt: -1 });
  res.json(data);
});

app.post('/announcements', verifyToken, upload.single('image'), async (req, res) => {
  const barangays = req.body.barangays
    ? JSON.parse(req.body.barangays)
    : ["All"];

  const newItem = new Announcement({
    title: req.body.title,
    content: req.body.content,
    barangays,
    image: req.file ? req.file.filename : null,
    pinned: false
  });

  await newItem.save();
  res.json(newItem);
});

app.put('/announcements/:id', verifyToken, async (req, res) => {
  await Announcement.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

app.delete('/announcements/:id', verifyToken, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ==========================
// 🎉 EVENTS
// ==========================
app.get('/events', async (req, res) => {
  const data = await Event.find().sort({ pinned: -1, createdAt: -1 });
  res.json(data);
});

app.post('/events', verifyToken, upload.single('image'), async (req, res) => {
  const barangays = req.body.barangays
    ? JSON.parse(req.body.barangays)
    : ["All"];

  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    barangays,
    image: req.file ? req.file.filename : null,
    pinned: false
  });

  await newEvent.save();
  res.json(newEvent);
});

app.put('/events/:id', verifyToken, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

app.delete('/events/:id', verifyToken, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ==========================
// 🚀 START SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));