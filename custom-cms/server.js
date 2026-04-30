require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Content = require('./models/Content');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-ivy-key';

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('<h1>Ivy Cloud CMS is Running</h1><p>Visit your production URL to manage content.</p>');
});

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Routes ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // In production, you'd check this against a User model.
  // For now, keeping your existing logic.
  if (username === 'admin' && password === 'ivyadmin123') {
    const token = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Content.find({}, 'name').sort({ name: 1 });
    res.json(collections.map(c => c.name));
  } catch (err) {
    res.status(500).json({ error: 'Error reading collections' });
  }
});

// Both /api/content/:collection and /api/:collection should work
app.get('/api/content/:collection', async (req, res) => {
  try {
    const content = await Content.findOne({ name: req.params.collection });
    if (!content) return res.status(404).json({ error: 'Collection not found' });
    res.json(content.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching content' });
  }
});

app.get('/api/:collection', async (req, res) => {
  try {
    const content = await Content.findOne({ name: req.params.collection });
    if (!content) return res.status(404).json({ error: 'Collection not found' });
    res.json(content.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching content' });
  }
});

app.post('/api/content/:collection', authenticateToken, async (req, res) => {
  try {
    await Content.findOneAndUpdate(
      { name: req.params.collection },
      { name: req.params.collection, data: req.body, lastUpdated: new Date() },
      { upsert: true }
    );
    res.json({ success: true, message: 'Content saved to Cloud DB!' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Image Upload (Local persistence for now - advise Cloudinary for Railway)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // For production, this should return a full URL or relative path handled by frontend
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  res.json({ url: `${protocol}://${host}/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Cloud CMS Backend running on http://localhost:${PORT}`);
});
