require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');

// 🔥 FIXED CLOUDINARY IMPORT (Node 24 safe)
const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary');

const CloudinaryStorage =
  cloudinaryStorage.CloudinaryStorage || cloudinaryStorage;

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
// ☁️ CLOUDINARY CONFIG
// ==========================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// 🔥 FIXED STORAGE (COMPATIBLE)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "cabagan",
    format: file.mimetype.split('/')[1],
    public_id: Date.now() + "-" + file.originalname
  })
});

const upload = multer({ storage });

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
  try {
    const barangays = req.body.barangays
      ? JSON.parse(req.body.barangays)
      : ["All"];

    const newItem = new Announcement({
      title: req.body.title,
      content: req.body.content,
      barangays,
      image: req.file ? req.file.path : null,
      pinned: false
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating announcement" });
  }
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
  try {
    const barangays = req.body.barangays
      ? JSON.parse(req.body.barangays)
      : ["All"];

    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      event_date: req.body.event_date,
      barangays,
      image: req.file ? req.file.path : null,
      pinned: false
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating event" });
  }
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