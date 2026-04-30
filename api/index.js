import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// --- DATABASE MODEL (Flattened for Vercel Stability) ---
const contentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now }
});
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

const app = express();

// Optimized Database Connection
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is missing');
  }

  try {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('DB Connection Fail:', err);
    throw err;
  }
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ivy-interactive',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif'],
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure DB is connected for every request
app.use(async (req, res, next) => {
  if (req.path === '/api' || req.path === '/api/login') return next();
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// --- Routes ---

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    env: {
      has_mongo: !!process.env.MONGO_URI,
      has_cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME
    }
  });
});

app.get('/api', (req, res) => {
  res.send('Ivy Cloud CMS API is active');
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'ivyadmin123') {
    const SECRET_KEY = process.env.JWT_SECRET || 'z8fNp9mK4/vL3qZ1A5B7C9D0E2F4G6H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4';
    const token = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token });
  } 
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Content.find({}, 'name').sort({ name: 1 });
    res.json(collections.map(c => c.name));
  } catch (err) {
    res.status(500).json({ error: 'Error reading collections' });
  }
});

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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  const SECRET_KEY = process.env.JWT_SECRET || 'z8fNp9mK4/vL3qZ1A5B7C9D0E2F4G6H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4';
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/content/:collection', authenticateToken, async (req, res) => {
  try {
    await Content.findOneAndUpdate(
      { name: req.params.collection },
      { name: req.params.collection, data: req.body, lastUpdated: new Date() },
      { upsert: true }
    );
    res.json({ success: true, message: 'Content saved to MongoDB Atlas!' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.path || req.file.url });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
